define(['backbone', 'env', 'stores'], function(
  Backbone, env, stores
  ) {
  var Thread = Backbone.Model.extend({
    idAttribute: "_id",
    initialize: function(options) {
    },
    url: function() {
      return env.apiServer + 'thread/' + (this.id?this.id:'');
    },
    defaults: {
      'subject': 'default subject.',
      'message': 'defualt message.'
    },
    addChildren: function(children) {
      var childrenIds = this.get('children');
      children.map(function(child) {
        return child.id || child;
      });
      this.set('children', _.uniq(_.extend([], childrenIds, children)));
      this.trigger('change:emit');
    },
    serialize: function() {
      var me = this.toJSON();
      me.children = this.getChildComments().map(function(child) {
        return child.serialize()
      });
      return me;
    },
    getChildComments: function() {
      return stores.getComments().where({
        parentId: this.id
      }) || [];
    }
  });

  return Thread;
});
