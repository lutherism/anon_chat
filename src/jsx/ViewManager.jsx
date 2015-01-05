define(['react', 'dispatcher', 'views/ThreadView', 'views/ThreadListView',
  'stores'], function (
  React,
  dispatcher,
  ThreadView,
  ThreadListView,
  stores
  ) {
  var ViewManager = React.createClass({
    componentDidMount: function(options) {
      this.el = 'body';
      stores.get('pathStore').on('change:emit', this.handlePathChange, this);
    },
    getInitialState: function() {
      return {
        'route': ''
      }
    },
    render: function() {
      var ret = <h2>404</h2>;
      console.log(this.state);
      switch (this.state.route) {
        case 'thread':
          if (this.state.subId) {
            ret = <ThreadView threadId={this.state.subId} />
          } else {
            ret = <ThreadListView />
          }
      }
      return ret;
    },
    handlePathChange: function() {
      this.setState({
        subId: stores.get('pathStore').get('subId'),
        route: stores.get('pathStore').get('route')
      });
    }
  });
  return ViewManager;
});
