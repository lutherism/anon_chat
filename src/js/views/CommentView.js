define(["react", "views/CommentView",
  "views/CommentActions", "markdown"], function(
    React, CommentView, CommentActions) {
  var CommentView = React.createClass({displayName: "CommentView",
    getInitialState: function() {
      return {
        showKids: true
      }
    },
    render: function() {
      var body = this.props.comment.bodyMd ?
          markdown.toHTML(this.props.comment.bodyMd) :
          this.props.comment.bodyText,
        childBoxes = this.state.showKids ?
          this.props.comment.children.map(function(comment, i) {
              return React.createElement(CommentView, {gray: !this.props.gray, key: i, 
              comment: comment});
            }.bind(this)) :
          null,
        toggleHide = this.state.showKids ? '-' : '+',
        toggleLabel = this.props.comment.children.length ?
          (React.createElement("label", {className: "text-default", onClick: this.clickHide}, 
          toggleHide
        )) : null;
      return (
          React.createElement("div", {className: "container clearfix", style: {
            borderLeft: "1px solid gray"
          }}, 
            React.createElement("h3", {dangerouslySetInnerHTML: {__html:body}, 
            className: "commentBody"}), 
            React.createElement(CommentActions, {comment: this.props.comment}), 
            toggleLabel, 
            React.createElement("div", {className: "list"}, 
              childBoxes
            )
          ));
    },
    clickHide: function() {
      this.setState({
        showKids: !this.state.showKids
      });
    }
  });
  return CommentView;
});
