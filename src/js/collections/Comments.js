define(['backbone', 'underscore', '../models/Comment', 'env', 'dispatcher'], function(
  Backbone, _, Comment, env, dispatcher
  ) {
  var Comments = Backbone.Collection.extend({
    model: Comment,
    name: 'comment',
    initialize: function(options) {
      this.dispatchId = dispatcher.register(this.handleDispatch.bind(this));
    },
    url: function() {
      return env.apiServer + 'comment/';
    },
    childrenOf: function(parent) {
      var self = this;
      this.fetch({
        url: this.url() + "?q=" + JSON.stringify({
          parentId: parent
        }),
        remove: false,
        success: function() {
          self.trigger('change:emit');
        }
      });
    },
    handleDispatch: function(payload) {
      if (payload.source === dispatcher.constants.VIEW_SOURCE) {
        if (payload.action.type === this.name) {
          switch (payload.action.concern) {
            case 'create':
              model = new this.model(payload.action.data);
              this.add(model);
              model.save();
              var parent = this.get(payload.action.data.parentId);
              if (parent) {
                parent.addChildren(this.where({
                  parentId: parent.id
                }));
                parent.trigger('change:emit');
              }
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
        }
      } else if (payload.source === dispatcher.constants.ROUTE_SOURCE) {
        if (payload.action.type === 'thread' && payload.action.data.subId) {
          this.childrenOf(payload.action.data.subId);
        }
      }
    }
  });

  return Comments;
});
