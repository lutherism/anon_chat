var Router = require('router'),
  NodeDAO = require('../dao/NodeDAO'),
  EdgesDAO = require('../dao/EdgesDAO'),
  apiUtils = require('../apiUtils'),
  NodeBL = require('../bl/NodeBL');

function edgesRouter(router) {
  router.param('_id', function(req, resp, next, _id) {
    req.id = _id;
    next();
  });

  router.route('/edges').all(function(req, resp) {
    var server;
    switch(req.method) {
      case 'OPTIONS':
        resp.writeHead(200, apiUtils.optionHeaders);
        resp.end();
        break;
      case 'POST':
        apiUtils.loadRequest(req, function(req, reqData) {
          EdgesDAO.create(reqData, function(err, models) {
            if (err) { resp.writeHead(505); resp.end();
            } else {
              resp.writeHead(200, apiUtils.successHeaders);
              resp.write(models[0]);
            }
          });
        });
        break;
      default:
        EdgesDAO.targetNodeIds('base', function(err, ids) {
          if (err) { resp.writeHead(505); resp.end();
          } else {
            resp.writeHead(200, apiUtils.successHeaders);
            resp.write(models);
          }
        });
        break;
    }
  });

  router.route('/edges/:_id').all(function(req, resp) {
    console.log("routing to " + serverGen.modelName + " " + req.id);
    var server;
    switch (req.method) {
      case 'OPTIONS':
      resp.writeHead(200, serverGen.optionHeaders);
      resp.end();
      break;
    case 'PUT':
      apiUtils.loadRequest(req, function(req, reqData) {
          EdgesDAO.updateById(req.id, reqData, function(err, models) {
            if (err) { resp.writeHead(505); resp.end();
            } else {
              resp.writeHead(200, apiUtils.successHeaders);
              resp.write(models[0]);
            }
          });
        });
      break;
    case 'DELETE':
      EdgesDAO.delete(req.id, function() {
        if (err) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write({success:true});
        }
      });
      break;
    default:
      NodeBL.nodeWithEdgeTypes(req.id, function(errs, node) {
        if (errs.length) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write(JSON.stringify(node));
        }
      });
    }
  });

}

module.exports = edgesRouter;
