define(['backbone', 'dispatcher'], function(
  Backbone, dispatcher
  ) {
  var Store = Backbone.Model.extend({
    initialize: function(options) {
      dispatcher.register(this.dispatchHandler.bind(this));
    },
    dispatchHandler: function(payload) {

    },
    getComments: function() {
      return this.get('commentStore');
    },
    getPath: function() {
      return this.get('pathStore');
    },
    getThreads: function() {
      return this.get('threadStore');
    }
  });
  return new Store();
});
