var BaseDAO = require('./BaseDAO');

var CommentDAO = BaseDAO.extend({
  findChildren: function(id, callback) {
    return this.find({parentId: id}, callback);
  }
});

module.exports = new CommentDAO({
  modelName: 'comment'
});
