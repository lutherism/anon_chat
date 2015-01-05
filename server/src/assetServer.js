var http = require('http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');

var mimeTypes = {
    "html": "text/html",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "png": "image/png",
    "js": "text/javascript",
    "jsx": "text/plain",
    "css": "text/css"
  };

module.exports = function server(req, resp) {
        var uri = url.parse(req.url).pathname,
          t = Date.now();
        if (uri === '/') uri = path.join(uri, 'src/html/index.html');
        var filename = path.join(process.cwd(), '..', uri);
        var mimeType = mimeTypes[uri.split(".")[1]];
        resp.writeHead(200, {
          'Content-Type': mimeType
        });
        if (!fs.existsSync(filename)){
          filename = path.join(process.cwd(), '..', 'src/html/index.html');
        }
        if (fs.existsSync(filename)){
          var fileStream = fs.createReadStream(filename);
          fileStream.pipe(resp);
          setTimeout(function() {
            fileStream.unpipe(resp);
            fileStream.close();
            resp.end();
          }, 1000);
        } else {
          resp.write("404");
          resp.end();
        }
        resp.once('finish', function() {
          console.log([(Date.now()-t), 'ms', req.method, req.url].join(' '));
        });
      };
