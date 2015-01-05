define(["underscore", "backbone", "react", "stores", "dispatcher", "pathStore"], function(
  _,
  Backbone,
  React,
  stores,
  dispatcher,
  PathStore
  ) {
  var MyRouter = Backbone.Router.extend({
    routes: {
      '': 'index',
      'thread/:id': 'thread',
      'thread': 'thread'
    },
    index: function() {
      this.navigate('thread');
    },
    thread: function(id) {
      dispatcher.dispatchRouteAction({
        type: 'thread',
        concern: 'create',
        data: {
          subId: id,
          route: 'thread'
        }
      });

    }
  });
  return MyRouter;
});
