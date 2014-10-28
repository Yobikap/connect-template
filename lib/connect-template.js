module.exports = function shtmlEmulator(json, template) {

    return function(req, res, next) {
        //var Buffer = require('buffer').Buffer;
        var WritableStream = require("stream-buffers").WritableStreamBuffer;

        var buffer = new WritableStream();

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
            
            try {
                body = template.process(body, json);
            } catch (e) {
                console.log('An error occurred while processing a template (' + e.message + ').');
            }
            
            oldEnd.call(context, body);
        };

        next();
    };
};
