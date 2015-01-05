define(['backbone', 'env', 'stores'], function(
  Backbone, env, stores
  ) {
  var Comment = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      return env.apiServer + 'comment/' + (this.id?this.id:'');
    },
    defaults: {
      'subject': 'default subject.',
      'message': 'defualt message.'
    },
    initialize: function() {
      stores.getComments().childrenOf(this.id);
      return Comment.__super__.initialize.apply(this, arguments);
    },
    serialize: function() {
      var me = this.toJSON();
      me.children = this.getChildComments().map(function(child) {
        return child.serialize()
      });
      return me;
    },
    addChildren: function(children) {
      var childrenIds = this.get('children');
      children.map(function(child) {
        return child.id || child;
      });
      this.set('children', _.uniq(_.extend([], childrenIds, children)));
      this.collection.trigger('change:emit');
    },
    getChildComments: function() {
      return stores.getComments().where({
        parentId: this.id
      }) || [];
    }
  });

  return Comment;
});
