define(["react", "stores", "views/CommentView", "views/ThreadActions",
  "dispatcher"], function(
    React, stores, CommentView, ThreadActions, dispatcher) {
  var ThreadRowView = React.createClass({
    getInitialState: function() {
      return {
        editing: false,
        textVal: this.props.thread.title //ititialize with title
      };
    },
    render: function() {
        if (!this.state.editing && this.props.thread._id) {
          return (<li><h2><a href={"thread/"+this.props.thread._id}>
            {this.props.thread.title}
          </a> <small onClick={this.edit}>Edit</small></h2></li>)
        } else {
          return (<li><input type="text" onChange={this.titleType}
            value={this.state.textVal} onKeyUp={this.keyUp}/>
            <small class="text-danger" onClick={this.delete}>Delete</small></li>);
        }
    },
    delete: function() {
      dispatcher.dispatchViewAction({
        type: 'thread',
        concern: 'delete',
        data: {
          _id: this.props.thread._id
        }
      });
    },
    edit: function() {
      this.setState({
        editing: true
      });
    },
    titleType: function(e) {
      this.setState({
        textVal: e.target.value
      });
    },
    keyUp: function(e) {
      switch(e.keyCode) {
        case 13:
          this.setState({
            editing: false
          });
          dispatcher.dispatchViewAction({
            type: 'thread',
            concern: 'update',
            data: {
              title: this.state.textVal,
              _id: this.props.thread._id
            }
          });
      }
    }
  });
  return ThreadRowView;
});