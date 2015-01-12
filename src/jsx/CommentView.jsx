define(["react", "views/CommentView",
  "views/CommentActions", "markdown"], function(
    React, CommentView, CommentActions) {
  var CommentView = React.createClass({
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
              return <CommentView gray={!this.props.gray} key={i}
              comment={comment} />;
            }.bind(this)) :
          null,
        toggleHide = this.state.showKids ? '-' : '+',
        toggleLabel = this.props.comment.children.length ?
          (<label className="text-default" onClick={this.clickHide}>
          {toggleHide}
        </label>) : null;
      return (
          <div className="container clearfix" style={{
            borderLeft: "1px solid gray"
          }}>
            <h3 dangerouslySetInnerHTML={{__html:body}}
            className="commentBody" />
            <CommentActions comment={this.props.comment}/>
            {toggleLabel}
            <div className="list">
              {childBoxes}
            </div>
          </div>);
    },
    clickHide: function() {
      this.setState({
        showKids: !this.state.showKids
      });
    }
  });
  return CommentView;
});
