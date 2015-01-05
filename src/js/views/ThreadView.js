define(["react", "stores", "views/CommentView", "views/ThreadActions"], function(
    React, stores, CommentView, ThreadActions) {
  var ThreadView = React.createClass({displayName: "ThreadView",
    getInitialState: function() {
      return {
        loading: true,
        threads: [],
        children: []
      }
    },
    componentDidMount: function(options) {
      stores.getThreads().on('change:emit', this.handleThreadsChange);
      stores.getComments().on('change:emit', this.handleCommentsChange);
    },
    handleThreadsChange: function() {
      var thread = stores.getThreads().get(this.props.threadId);
      this.setState({
        thread: thread.serialize(),
        loading: false
      });
    },
    handleCommentsChange: function() {
      var thread = stores.getThreads().get(this.props.threadId);
      if (thread) {
        this.setState({
          thread: thread.serialize(),
          loading: false
        });
      }
    },
    render: function() {
      if (this.state.thread) {
        return (
          React.createElement("div", {className: "container clearfix"}, 
            React.createElement("label", null, React.createElement("a", {href: "../thread"}, "Back")), 
            React.createElement("div", {className: "thread-info"}, 
              React.createElement("h2", null, this.state.thread.title, " ", React.createElement("small", null, this.state.thread.bodyText))
            ), 
            React.createElement(ThreadActions, {threadId: this.props.threadId}), 
            React.createElement("div", {className: "list"}, 
            this.state.thread.children.map(function(comment, i) {
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
