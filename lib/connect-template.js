module.exports = function shtmlEmulator(json, template) {

    var url = require('url'),
        parseurl = require('parseurl');

    return function(req, res, next) {

        var Buffer = require('buffer').Buffer;
        var WritableStream = require("stream-buffers").WritableStreamBuffer;

        var buffer = new WritableStream();

        var originalUrl = url.parse(req.originalUrl || req.url);
        var path = parseurl(req).pathname;

        if (req.url.match(/\.s?html$/) || originalUrl.pathname[originalUrl.pathname.length - 1] == '/') {

            var oldWrite = res.write;
            res.write = function(chunk) {
                buffer.write(chunk);
                return true;
            };

            var oldEnd = res.end;
            res.end = function(data) {
                var context = this;

                if(data) {
                    buffer.write(data);
                }

                if (!buffer.size()) {
                    return oldEnd.call(context, buffer.getContents());
                }

                var body = buffer.getContentsAsString();

                body = template.process(body, { data: json });

                res.setHeader('Content-Length', body.length);

                return oldEnd.call(context, body);
            };
        }

        next();
    };
};
