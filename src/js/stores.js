define(['backbone', 'dispatcher', 'pathStore', 'collections/Comments',
  'collections/Threads'], function(
  Backbone, dispatcher, PathStore, Comments, Threads
  ) {
  var Store = Backbone.Model.extend({
    initialize: function(options) {
      dispatcher.register(this.dispatchHandler.bind(this));
    },
    requiredThreadRouteStores: {
      'commentStore': Comments,
      'pathStore': PathStore,
      'threadStore': Threads
    },
    dispatchHandler: function(payload) {
      if (payload.source === dispatcher.constants.ROUTE_ACTION) {
        if (payload.action.type === 'thread') {
          this.closeUselessStores(this.requiredThreadRouteStores);
          this.requiredThreadRouteStores.map(function(key, val) {
            this.ensureCreated(key, val);
          });
        }
      }
    },
    handleRfisRoute: function(payload) {
      var storesRequired = {
        'commentStore': Comments,
        'pathStore': PathStore,
        'threadStore': Threads
      };
      storerRequired.map(function(key, val) {
        this.ensureCreated(key, val)
      });
    },
    closeUselessStores: function(new) {
      this.map(function (key, val) {
        if (!new[key]) {
          this.get(key).destroy();
          this.unset(key);
          this.trigger('change:emit');
        }
      })
    },
    ensureCreated: function(prop, cons) {
      if (!this.get(prop)) {
        this.set(prop, new cons());
        this.trigger('change:emit');
      }
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
