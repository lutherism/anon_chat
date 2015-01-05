var BaseDAO = require('./BaseDAO');

var EdgesDAO = BaseDAO.extend({
  makeId: function() {
    return Array.prototype.slice.call(arguments).join(',');
  },
  // returns array of edge id strings
  getEdgeTypes: function(nodeId, callback) {
    this.getEdges(nodeId, function(err, models) {
      if (err) this.handleErrors(err);
      var types = models.map(function(model) {
        return model.id;
      });
      callback(err, types);
    });
  },
  getEdgesForNode: function(nodeId, callback) {
    this.getById((new RegExp("^"+nodeId)), function(err, models) {
      if (err) this.handleErrors(err);
      callback(err, models);
    });
  },
  targetNodes: function(nodeId, callback) {
    this.getEdgesForNode(nodeId, function(err, models) {
      if (models[0] && models[0].targets.length) {
        callback(err, models[0].targets);
      } else {
        callback(null, []);
      }
    });
  }
});

module.exports = new EdgesDAO({
  modelName: 'edges'
});
