define(["react", "stores", "views/CommentView", "views/ThreadActions"], function(
    React, stores, CommentView, ThreadActions) {
  var ThreadView = React.createClass({
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
          <div className="container clearfix">
            <label><a href="../thread">Back</a></label>
            <div className="thread-info">
              <h2>{this.state.thread.title} <small>{this.state.thread.bodyText}</small></h2>
            </div>
            <ThreadActions threadId={this.props.threadId} />
            <div className="list">
            {this.state.thread.children.map(function(comment, i) {
              return <CommentView gray={false} key={i} comment={comment} />
            })}
            </div>
          </div>);
        } else {
          return (<h3>Loading...</h3>);
        }
    }
  });
  return ThreadView;
});
