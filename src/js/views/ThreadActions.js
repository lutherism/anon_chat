define(["react", "stores", "dispatcher"], function(
    React, stores, dispatcher
  ) {
  var ThreadActions = React.createClass({displayName: "ThreadActions",
    getInitialState: function() {
      return {
        replying: false,
        bodyText: ""
      }
    },
    handleThreadEmit: function() {

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
          React.createElement("div", {className: "container"}, 
              React.createElement("textarea", {className: "form-group", onChange: this.replyType}), 
            React.createElement("h3", {className: "pull-right text-sucess", 
              value: this.state.bodyText, onClick: this.submit}, 
              "Submit"
            )
          ));
      }
      return (React.createElement("div", {className: "actions"}, 
        React.createElement("small", {className: "text-default del", 
          onClick: this.reply}, 
          "Reply"
        ), 
        replybox));
    },

  });
  return ThreadActions;
});
