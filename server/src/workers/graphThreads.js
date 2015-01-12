var ThreadDAO = require('../dao/ThreadDAO'),
  CommentDAO = require('../dao/CommentDAO'),
  NodeDAO = require('../dao/NodeDAO'),
  EdgesDAO = require('../dao/EdgesDAO'),
  mongoose = require('mongoose'),
  NodeBL = require('../bl/NodeBL');


function addCommentsTo(models, rootId) {
  var reducedModels = models.map(function(model) {
    return {
      id: model._id+'/comment',
      weight: 1
    }
  });
  EdgesDAO.find({
    _id: rootId+'/child_comments'
  }, function(err, models) {
    if (!models.length) {
      EdgesDAO.create({
        _id: rootId+'/child_comments',
        targets: reducedModels
      }, function(err, model) {
        console.log(rootId + ' has '+models.length+' child comments.');
        if (err) console.log('error: ', err);
      });
    } else {
      EdgesDAO.updateById(rootId+'/child_comments', {
        targets: reducedModels
      }, function(err, model) {
        console.log(rootId + ' has '+models.length+' child comments.');
        if (err) console.log('error: ', err);
      });
    }
  })
}
mongoose.connect('mongodb://localhost:27017');
console.log('connecting to DB...');
mongoose.connection.on('open', function() {
  ThreadDAO.getCollection(function(err, models) {
    models.map(function(threadModel) {
      NodeDAO.find({
        _id: threadModel._id+'/thread'
      }, function(err, nodeModels) {
        if (err) console.log(err);
        CommentDAO.find({
          parentId: threadModel._id
        }, function(err, models) {
          if (models.length && nodeModels) {
            addCommentsTo(models, nodeModels[0]._id);
          } else {
            console.log('error:', models.length, nodeModels)
          }
        })
      });
    });
  });

  CommentDAO.getCollection(function(err, models) {
    models.map(function(threadModel) {
      NodeDAO.find({
        _id: threadModel._id+'/comment'
      }, function(err, nodeModels) {
        if (!nodeModels.length) {
          NodeDAO.create({
            _id: threadModel._id+'/comment'
          }, function(err, nodeModels) {
            if (models.length && nodeModels) {
              addCommentsTo(models, nodeModels[0]._id);
            } else {
              console.log('error:', models.length, nodeModels)
            }
          });
        } else {
          CommentDAO.find({
            parentId: threadModel._id
          }, function(err, models) {
            if (models.length && nodeModels) {
              addCommentsTo(models, nodeModels[0]._id);
            } else {
              console.log('error:', models.length, nodeModels)
            }
          });
        }
      });
    });
  });
});
