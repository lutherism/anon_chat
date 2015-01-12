define(["react", "views/CommentView", "views/ThreadActions",
  "views/ThreadRowView", "dispatcher", "views/WatchStores", "stores"], function(
    React, CommentView, ThreadActions, ThreadRowView, dispatcher, WatchStores,
    stores
  ) {
  var ThreadListView = React.createClass({displayName: "ThreadListView",
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
        return (React.createElement("div", {className: "container"}, 
          React.createElement("ul", {className: "thread-list"}, 
          
            threads.map(function(thread, i) {
              return thread._id?
                React.createElement(ThreadRowView, {thread: thread, key: i}):null;
            })
          
          ), React.createElement("label", {className: "text-success", onClick: this.createThread}, 
            "Create Thread"
          ))
          )
        } else {
          return (React.createElement("h3", null, "Loading..."));
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
