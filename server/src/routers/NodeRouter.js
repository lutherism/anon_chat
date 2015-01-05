var Router = require('router'),
  NodeDAO = require('../dao/NodeDAO'),
  EdgesDAO = require('../dao/EdgesDAO'),
  apiUtils = require('../apiUtils'),
  NodeBL = require('../bl/NodeBL');

function nodeRouter(router) {
  router.param('_id', function(req, resp, next, _id) {
    req.id = _id;
    next();
  });

  router.route('/node').all(function(req, resp) {
    var server;
    switch(req.method) {
      case 'OPTIONS':
        resp.writeHead(200, apiUtils.optionHeaders);
        resp.end();
        break;
      case 'POST':
        apiUtils.loadRequest(req, function(req, reqData) {
          NodeDAO.create(reqData, function(err, models) {
            if (err) { resp.writeHead(505); resp.end();
            } else {
              resp.writeHead(200, apiUtils.successHeaders);
              resp.write(JSON.stringify(models[0]));
              resp.end();
            }
          });
        });
        break;
      default:
        EdgesDAO.targetNodes('root,node', function(err, models) {
          if (err) { resp.writeHead(505); resp.end();
          } else {
            resp.writeHead(200, apiUtils.successHeaders);
            resp.write(JSON.stringify(models));
            resp.end();
          }
        });
        break;
    }
  });

  router.route('/node/:_id').all(function(req, resp) {
    switch (req.method) {
      case 'OPTIONS':
      resp.writeHead(200, serverGen.optionHeaders);
      resp.end();
      break;
    case 'PUT':
      apiUtils.loadRequest(req, function(req, reqData) {
          NodeDAO.updateById(req.id, reqData, function(err, models) {
            if (err) { resp.writeHead(505); resp.end();
            } else {
              resp.writeHead(200, apiUtils.successHeaders);
              resp.write(models[0]);
              resp.end();
            }
          });
        });
      break;
    case 'DELETE':
      NodeDAO.delete(req.id, function() {
        if (err) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write({success:true});
          resp.end();
        }
      });
      break;
    default:
      NodeBL.buildWeightedGraph(req.id+',node', 'edges', 10, .7, function(errs, graph) {
        if (errs) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write(JSON.stringify(graph));
          resp.end();
        }
      });
    }
  });

}

module.exports = nodeRouter;
