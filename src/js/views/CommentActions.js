define(["react", "stores", "dispatcher", "markdown"], function(
    React, stores, dispatcher
  ) {
  var ThreadActions = React.createClass({displayName: "ThreadActions",
    getInitialState: function() {
      return {
        replying: false,
        bodyText: "",
        markdown: false,
        showKids: true
      }
    },
    handleThreadEmit: function() {

    },
    reply: function() {
      this.setState({
        'replying': !this.state.replying
      });
    },
    delete: function() {
      if (this.props.comment.children.length > 0) {
        alert("You can't delete comments with children");
      } else {
        dispatcher.dispatchViewAction({
          type: 'comment',
          concern: 'delete',
          data: {
            id: this.props.comment._id
          }
        });
      }
    },
    replyType: function(e) {
      this.setState({
        bodyText: e.target.value
      });
    },
    submit: function() {
      var now = new Date();
      this.setState({
        replying: false
      });
      dispatcher.dispatchViewAction({
        type: 'comment',
        concern: 'create',
        data: {
          createdOn: now,
          bodyText: this.state.bodyText,
          bodyMd: this.state.bodyText,
          parentId: this.props.comment._id,
          lastEdited: now,
          children: []
        }
      });
    },
    check: function() {
      this.setState({
        markdown: !this.state.markdown
      });
    },
    render: function() {
      var replybox = null,
        markDownPreview = !this.state.markdown ? null:
          (React.createElement("div", {class: "markdown-preview", 
            dangerouslySetInnerHTML: 
{__html:markdown.toHTML(this.state.bodyText)}}));
      if (this.state.replying) {
        replybox = (
          React.createElement("div", {className: "container"}, 
              markDownPreview, 
              React.createElement("textarea", {className: "form-group", onChange: this.replyType}), React.createElement("br", null), 
              React.createElement("small", null, React.createElement("input", {type: "checkbox", onChange: this.check, 
              checked: this.state.markdown}), " show preview. "), 
            React.createElement("label", {className: "text-success", 
              value: this.state.bodyText, onClick: this.submit}, 
              "Submit"
            )
          ));
      }
      return (React.createElement("div", {className: "actions"}, 
        React.createElement("small", {className: "text-default reply", 
          onClick: this.reply}, 
          "Reply"
        ), 
        React.createElement("small", {className: "text-default reply", 
          onClick: this.delete}, 
          "Delete"
        ), 
        replybox
      ));
    }
  });
  return ThreadActions;
});
