var Router = require('router'),
  ServerGenerator = require('../ServerGenerator'),
  url = require('url'),
  CommentDAO = require('../dao/CommentDAO'),
  apiUtils = require('../apiUtils');

function CommentRouter(router, endpointName) {
  var serverGen = new ServerGenerator({
    modelName: 'comment'
  });

  router.param('_id', function(req, resp, next, _id) {
    req.id = _id;
    next();
  });

  router.route('/comment').all(function(req, resp) {
    var server;
    switch(req.method) {
      case 'OPTIONS':
        server = function(req, resp) {
          resp.writeHead(200, serverGen.optionHeaders);
          resp.end();
        }
        break;
      case 'POST':
        server = serverGen.serve(function (req, reqData, callback) {
          serverGen.createNew(reqData, function(err, model) {
            callback(err, {
              headCode: 200,
              headers: serverGen.successHeaders,
              write: JSON.stringify(model)
            });
          });
        });
        break;
      default:
        console.log(typeof url.parse(req.url, true).query);
        CommentDAO.find(url.parse(req.url, true).query,
          function(err, models) {
          console.log('found', models);
          if (err) {resp.writeHead(500, null); resp.end();
          } else {
            resp.writeHead(200, apiUtils.successHeaders);
            resp.write(JSON.stringify(models));
            resp.end();
          }
        });
        break;
    }
    if (server) server(req, resp);
  });

  router.route('/comment/:_id').all(function(req, resp) {
    console.log("routing to " + serverGen.modelName + " " + req.id);
    var server;
    switch (req.method) {
      case 'OPTIONS':
      server = function(req, resp) {
        console.log(req, resp);
        resp.writeHead(200, serverGen.optionHeaders);
        resp.end();
      };
      break;
    case 'PUT':
      server = serverGen.serve(function (req, reqData, callback) {
        console.log(reqData);
        serverGen.updateById(req.id, reqData, function(err, model) {
          callback(err, {
            headCode: 200,
            headers: serverGen.successHeaders,
            write: JSON.stringify({success: true})
          });
        });
      });
      break;
    case 'DELETE':
      server = serverGen.serve(function (req, reqData, callback) {
        serverGen.deleteById(req.id, function(err, model) {
          callback(err, {
            headCode: 200,
            headers: serverGen.successHeaders,
            write: JSON.stringify({success: true})
          });
        });
      });
      break;
    default:
      server = serverGen.serve(function(req, reqData, callback) {
        serverGen.getById(req.id, function(err, model) {
          callback(err, {
            headCode: 200,
            headers: serverGen.optionHeaders,
            write: JSON.stringify(model[0])
          });
        });
      });
    }
    server(req, resp);
  });
}
module.exports = CommentRouter;
