var Router = require('router'),
  ServerGenerator = require('../ServerGenerator'),
  url = require('url');

function crudRouter(router, endpointName) {
  var serverGen = new ServerGenerator({
    modelName: endpointName
  });

  router.param('_id', function(req, resp, next, _id) {
    req.id = _id;
    next();
  });

  router.route('/' + endpointName).all(function(req, resp) {
    console.log("routing to " + serverGen.modelName);
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
        server = serverGen.serve(function (req, reqData, callback) {
          var qs = url.parse(req.url, true).query;
          console.log(qs);
          if (qs.q) {
            serverGen.model.find(JSON.parse(qs.q), function(err, models) {
              callback(err, {
                headCode: 200,
                headers: serverGen.successHeaders,
                write: JSON.stringify(models),
                console: "query comments returned"
              });
            });
          } else {
            serverGen.getCollection(function(err, models) {
              callback(err, {
                headCode: 200,
                headers: serverGen.successHeaders,
                write: JSON.stringify(models),
                console: "comments"
              });
            });
          }
        });
        break;
    }
    server(req, resp);
  });

  router.route('/' + endpointName + '/:_id').all(function(req, resp) {
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
module.exports = crudRouter;
