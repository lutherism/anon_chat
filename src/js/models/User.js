define(['backbone', 'env'], function(
  Backbone, env
  ) {
  var User = Backbone.Model.extend({
    idAttribute: "_id",
    url: function() {
      return env.apiServer + 'user/' + (this.id?this.id:'');
    },
    defaults: {
      'subject': 'default subject.',
      'message': 'defualt message.'
    }
  });

  return User;
});
