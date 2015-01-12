define(['react', 'backbone'], function(
  React, Backbone) {
  var WatchStores = {
    componentWillMount: function() {
      this.__listingToStores = [];
      if (this._watchStores) {
        this._watchStores().forEach(function(store) {
          this.__listingToStores.push(store);
          store.on('change:emit', this.forceUpdate.bind(this));
        }.bind(this));
      }
    },
    componentWillUnmount: function() {
      this.__listingToStores.forEach(function(store) {
        if (store.off) {
          store.off('change:emit', this.forceUpdate.bind(this));
        }
      });
    }
  };

  return WatchStores;
})
