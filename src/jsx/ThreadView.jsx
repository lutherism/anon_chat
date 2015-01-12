define(["react", "stores", "views/CommentView", "views/ThreadActions",
  'views/WatchStores'], function(
    React, stores, CommentView, ThreadActions, WatchStores) {
  var ThreadView = React.createClass({
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
          <div className="container clearfix">
            <label><a href="../thread">Back</a></label>
            <div className="thread-info">
              <h2>{thread.title} <small>{thread.bodyText}</small></h2>
            </div>
            <ThreadActions threadId={this.props.threadId} />
            <div className="list">
            {thread.children.map(function(comment, i) {
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
