define(["react", "stores", "views/CommentView", "views/ThreadActions",
  'views/WatchStores'], function(
    React, stores, CommentView, ThreadActions, WatchStores) {
  var ThreadView = React.createClass({displayName: "ThreadView",
    mixins: [WatchStores],
    _watchStores: function() {
      return [
        stores.getThreads(),
        stores.getComments()
      ];
    },
    render: function() {
      var thread = stores.getThreads().get(this.props.threadId);
      if (thread) {
        thread = thread.serialize();
        return (
          React.createElement("div", {className: "container clearfix"}, 
            React.createElement("label", null, React.createElement("a", {href: "../thread"}, "Back")), 
            React.createElement("div", {className: "thread-info"}, 
              React.createElement("h2", null, thread.title, " ", React.createElement("small", null, thread.bodyText))
            ), 
            React.createElement(ThreadActions, {threadId: this.props.threadId}), 
            React.createElement("div", {className: "list"}, 
            thread.children.map(function(comment, i) {
              return React.createElement(CommentView, {gray: false, key: i, comment: comment})
            })
            )
          ));
        } else {
          return (React.createElement("h3", null, "Loading..."));
        }
    }
  });
  return ThreadView;
});
