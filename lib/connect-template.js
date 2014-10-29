module.exports = function shtmlEmulator(json, template) {

    return function(req, res, next) {
        var Buffer = require('buffer').Buffer;
        var WritableStream = require("stream-buffers").WritableStreamBuffer;

        var buffer = new WritableStream();
        
        if(req.url != "/" && !req.url.match(/\.s?html$/))
            return next();
        
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

            return oldEnd.call(context, body);

        };

        next();
    };
};
