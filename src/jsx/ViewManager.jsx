define(['react', 'dispatcher', 'views/ThreadView', 'views/ThreadListView',
  'stores', 'views/WatchStores'], function (
  React,
  dispatcher,
  ThreadView,
  ThreadListView,
  stores,
  WatchStores
  ) {
  var ViewManager = React.createClass({
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
      var ret = <h2>404</h2>;
      console.log(this.state);
      switch (stores.get('pathStore').get('route')) {
        case 'thread':
          if (stores.get('pathStore').get('subId')) {
            ret = <ThreadView threadId={stores.get('pathStore').get('subId')} />
          } else {
            ret = <ThreadListView />
          }
      }
      return ret;
    }
  });
  return ViewManager;
});
