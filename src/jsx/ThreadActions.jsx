define(["react", "dispatcher"], function(
    React, dispatcher
  ) {
  var ThreadActions = React.createClass({
    getInitialState: function() {
      return {
        replying: false,
        bodyText: ""
      }
    },
    reply: function() {
      this.setState({
        'replying': !this.state.replying,
        bodyText: ""
      });
    },
    replyType: function(e) {
      this.setState({
        bodyText: e.target.value
      });
    },
    submit: function() {
      var now = new Date();
      this.setState({
        replying: false,
        bodyText: ""
      });
      dispatcher.dispatchViewAction({
        type: 'comment',
        concern: 'create',
        data: {
          createdOn: now,
          bodyText: this.state.bodyText,
          parentId: this.props.threadId,
          lastEdited: now,
          children: []
        }
      });
    },
    render: function() {
      var replybox = null;
      if (this.state.replying) {
        replybox = (
          <div className="container">
              <textarea className="form-group" onChange={this.replyType} />
            <h3 className="pull-right text-sucess"
              value={this.state.bodyText} onClick={this.submit}>
              Submit
            </h3>
          </div>);
      }
      return (<div className="actions">
        <small className="text-default del"
          onClick={this.reply}>
          Reply
        </small>
        {replybox}</div>);
    },

  });
  return ThreadActions;
});
