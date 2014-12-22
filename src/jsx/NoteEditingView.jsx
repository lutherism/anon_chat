define(["react", "stores", "dispatcher"], function(
  React, stores, dispatcher
  ) {
  var NoteEditingView = React.createClass({
    getInitialState: function() {
      return {
        'subject': stores.getNotes().get(this.props.noteId).get('subject'),
        'body': stores.getNotes().get(this.props.noteId).get('message')
      };
    },
    componentDidMount: function(options) {
      this.setState({})
    },
    render: function() {
      return (
        <div className="form-group">
          <label>Subject:</label>
          <input className="form-input" value={this.state.subject}
            onChange={this.setSubject} />
          <label>Body</label>
          <textarea className="text-input" value={this.state.body}
            onChange={this.setBodyState}/>
          <button onClick={this.cancelEdit}
            className="btn btn-xs btn-defualt">Cancel</button>
          <button onClick={this.saveNote}
            className="btn btn-xs btn-success">Save</button>
        </div>
      )
    },
    setBodyState: function(e) {
      this.setState({
        body: e.target.value
      });
    },
    setSubjectState: function(e) {
      this.setState({
        subject: e.target.value
      });
    },
    cancelEdit: function() {
      dispatcher.dispatchViewAction({
        type: 'notes',
        concern: 'update',
        data: {
          id: this.props.noteId,
          editing: false
        }
      });
    },
    saveNote: function() {
      dispatcher.dispatchViewAction({
        type: 'notes',
        concern: 'update',
        data: {
          cid: this.props.noteId,
          subject: this.state.subject,
          message: this.state.body,
          editing: false
        }
      });
      dispatcher.dispatchViewAction({
        type: 'notes',
        concern: 'save',
        data: {
          cid: this.props.noteId
        }
      });
    }
  });
  return NoteEditingView;
});
