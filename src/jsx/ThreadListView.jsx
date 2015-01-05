define(["react", "stores", "views/CommentView", "views/ThreadActions",
  "views/ThreadRowView", "dispatcher"], function(
    React, stores, CommentView, ThreadActions, ThreadRowView, dispatcher
  ) {
  var ThreadListView = React.createClass({
    getInitialState: function() {
      return {
        loading: true,
        threads: []
      }
    },
    componentDidMount: function(options) {
      stores.getThreads().on('change:emit', this.handleThreadsChange);
      stores.getThreads().fetch();
    },
    handleThreadsChange: function() {
      this.setState({
        threads:  stores.getThreads().toJSON(),
        loading: false
      });
    },
    render: function() {
      var threads = stores.getThreads();
      if (threads) {
        return (<div className="container">
          <ul className="thread-list">
          {
            this.state.threads.map(function(thread, i) {
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


function escapeHtml(unsafe) {
    return unsafe
         .split(/&/g).join("&amp;")
         .split(/</g).join("&lt;")
         .split(/>/g).join("&gt;")
         .split(/"/g).join("&quot;")
         .split(/'/g).join("&#039;");
 }

function unescapeHtml(safe) {
    return safe
         .split("&amp;").join("&")
         .split("&lt;").join("<")
         .split("&gt;").join(">")
         .split("&quot;").join('"')
         .split("&#039;").join("'");
 }

