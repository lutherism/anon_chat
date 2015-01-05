define(['backbone', 'dispatcher'], function (
  Backbone,
  dispatcher
  ) {
  var PathStore = Backbone.Model.extend({
    initialize: function(options) {
      this.options = options || {};
      this.dispatchId = dispatcher.register(this.dispatchHandler.bind(this));
    },
    dispatchHandler: function(payload) {
      if (payload.source === dispatcher.constants.ROUTE_SOURCE) {
        switch (payload.action.concern) {
          case 'create':
          case 'update':
            this.set(payload.action.data);
            this.trigger('change:emit');
            break;
        }
      }
    }
  });
  return PathStore;
});
