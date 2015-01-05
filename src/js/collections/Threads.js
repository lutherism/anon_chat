define(['backbone', 'underscore', 'models/Thread', 'env', 'dispatcher', 'stores'], function(
  Backbone, _, Thread, env, dispatcher, stores
  ) {
  var Threads = Backbone.Collection.extend({
    model: Thread,
    name: 'thread',
    initialize: function(options) {
      this.dispatchId = dispatcher.register(this.handleDispatch.bind(this));
    },
    url: function() {
      return env.apiServer + 'thread/';
    },
    handleDispatch: function(payload) {
      var stores = require('stores');
      if (payload.source === dispatcher.constants.VIEW_SOURCE) {
        if (payload.action.type === this.name) {
          switch (payload.action.concern) {
            case 'create':
              model = new this.model(payload.action.data);
              this.add(model);
              model.save();
              this.trigger('change:emit');
              break;
            case 'update':
              var model = this.get(payload.action.data._id);
              model.set(payload.action.data);
              model.save();
              model.trigger('change:emit');
              this.trigger('change:emit');
              break;
            case 'delete':
              this.find(payload.action.data).destroy();
              this.trigger('change:emit');
              break;
          }
        } else if (payload.action.type === 'comment') {
          dispatcher.waitFor([stores.getComments().dispatchId]);
          switch (payload.action.concern) {
            case 'create':
              var parent = this.get(payload.action.data.parentId);
              if (parent) {
                parent.addChildren(stores.getComments().where({
                  parentId: parent.id
                }));
                parent.trigger('change:emit');
              }
              break;
          }
        }
      } else if (payload.source === dispatcher.constants.ROUTE_SOURCE) {
        dispatcher.waitFor([stores.getPath().dispatchId]);
        if (payload.action.type === 'thread') {
          if (payload.action.data.subId) {
            var newThread = new Thread({
              _id: payload.action.data.subId
            });
            newThread.fetch({
              success: function() {
                this.add(newThread);
                newThread.trigger('change:emit');
                this.trigger('change:emit');
              }.bind(this)
            });
          } else {
            this.fetch({
              success: function() {
                this.trigger('change:emit');
              }.bind(this)
            });
          }
        }
      }
    }
  });

  return Threads;
});
