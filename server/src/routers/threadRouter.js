var Router = require('router'),
  ServerGenerator = require('../ServerGenerator'),
  ThreadDAO = require('../dao/ThreadDAO'),
  apiUtils = require('../apiUtils'),
  CommentDAO = require('../dao/CommentDAO'),
  NodeBL = require('../bl/NodeBL');

function threadRouter(router) {
  router.param('_id', function(req, resp, next, _id) {
    req.id = _id;
    next();
  });

  router.route('/thread').all(function(req, resp) {
    switch(req.method) {
      case 'OPTIONS':
        resp.writeHead(200, apiUtils.optionHeaders);
        resp.end();
        break;
      case 'POST':
        apiUtils.loadRequest(req, function(req, reqData) {
          ThreadDAO.create(reqData, function(err, models) {
            if (err) { resp.writeHead(505); resp.end();
            } else {
              resp.writeHead(200, apiUtils.successHeaders);
              resp.write(JSON.stringify(models));
              resp.end();
            }
          });
        });
        break;
      default:
      console.log('routed to get thread')
        ThreadDAO.getCollection(function(err, models) {
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

  router.route('/thread/:_id').all(function(req, resp) {
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
      ThreadDAO.delete(req.id, function() {
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
      ThreadDAO.getById(req.id,function(errs, graph) {
        if (errs) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write(JSON.stringify(graph[0]));
          resp.end();
        }
      });
    }
  });

  router.route('/thread/:_id/tree').all(function(req, resp) {
    NodeBL.buildWeightedGraph(req.id+'/thread', 'child_comments',
      5, .9, function(err, graph) {
        if (err) {
          resp.writeHead(505); resp.end();
        } else {
          resp.writeHead(200, apiUtils.successHeaders);
          resp.write(JSON.stringify(graph));
          resp.end();
        }
      });
  });

  function returnWithChildren(id, callback) {
    NodeBL.buildWeightedGraph(id+'/thread', 'child_comments', 50, .9, callback);
  }
}

module.exports = threadRouter;
