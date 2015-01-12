define(['react', 'dispatcher', 'views/ThreadView', 'views/ThreadListView',
  'stores', 'views/WatchStores'], function (
  React,
  dispatcher,
  ThreadView,
  ThreadListView,
  stores,
  WatchStores
  ) {
  var ViewManager = React.createClass({displayName: "ViewManager",
    mixins: [WatchStores],
    _watchStores: function() {
      return [stores.get('pathStore')];
    },
    getInitialState: function() {
      return {
        'route': ''
      }
    },
    render: function() {
      var ret = React.createElement("h2", null, "404");
      console.log(this.state);
      switch (stores.get('pathStore').get('route')) {
        case 'thread':
          if (stores.get('pathStore').get('subId')) {
            ret = React.createElement(ThreadView, {threadId: stores.get('pathStore').get('subId')})
          } else {
            ret = React.createElement(ThreadListView, null)
          }
      }
      return ret;
    }
  });
  return ViewManager;
});
