define(["react", "views/CommentView", "views/ThreadActions",
  "views/ThreadRowView", "dispatcher", "views/WatchStores", "stores"], function(
    React, CommentView, ThreadActions, ThreadRowView, dispatcher, WatchStores,
    stores
  ) {
  var ThreadListView = React.createClass({
    mixins: [WatchStores],
    getInitialState: function() {
      return {
        loading: true,
        threads: []
      }
    },
    _watchStores: function() {
      return [
        stores.getThreads()
      ]
    },
    render: function() {
      var threads = stores.getThreads().toJSON();
      if (threads) {
        return (<div className="container">
          <ul className="thread-list">
          {
            threads.map(function(thread, i) {
              return thread._id?
                <ThreadRowView thread={thread} key={i} />:null;
            })
          }
          </ul><label className="text-success" onClick={this.createThread}>
            Create Thread
          </label></div>
          )
        } else {
          return (<h3>Loading...</h3>);
        }
    },
    createThread: function() {
      dispatcher.dispatchViewAction({
        type: 'thread',
        concern: 'create'
      });
    }
  });
  return ThreadListView;
});
