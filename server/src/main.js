var crudRouter = require('./routers/crudRouter'),
  Router = require('router'),
  threadRouter = require('./routers/threadRouter'),
  NodeRouter = require('./routers/NodeRouter'),
  EdgesRouter = require('./routers/EdgesRouter'),
  CommentRouter = require('./routers/CommentRouter');


function authRequest(req, callback) {
  callback();
}

var my_servers = {
    newApiServer: function() {
      var crudRoutes = ['user'],
        myRouter = new Router();

      for (var i in crudRoutes) {
        crudRouter(myRouter, crudRoutes[i]);
      }

      threadRouter(myRouter);
      NodeRouter(myRouter);
      EdgesRouter(myRouter);
      CommentRouter(myRouter);

      return function (req, resp) {
        var t = Date.now();
        authRequest(req, function() {
           myRouter(req, resp, console.log);
        });
        resp.once('finish', function() {
          console.log([(Date.now()-t), 'ms', req.method, req.url].join(' '));
        });
      };
    },
    newServer: function() {
      return require('./assetServer');
    }
};

module.exports = my_servers;
