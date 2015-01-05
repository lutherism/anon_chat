var mongoose = require('mongoose'),
  extend = require('../extend'),
  dbSpec = require('../../mongo/dbSpec');

function BaseDAO(options) {
  this.options = options || {};
    if (this.options.modelName) {
      this.modelName = this.options.modelName;
      this.dbModel = dbSpec.models[this.modelName];
      this.schema = new mongoose.Schema(this.dbModel.schema);
      if (mongoose.modelNames().indexOf(this.dbModel.name) === -1) {
        this.model = mongoose.model(this.dbModel.name, this.schema);
      } else {
        this.model = mongoose.model(this.dbModel.name);
      }
    }
    return this.initialize.apply(this, arguments);
}

BaseDAO.prototype = {
  initialize: function() {
    return this;
  },
  find: function(filter, callback, context){
    return this.model.find(filter, function(err, models) {
      if (err) this.handleErrors(err);
      callback.apply(context, arguments);
    });
  },
  getCollection: function(callback) {
    var filter = null;
    this.model.find(filter, callback);
  },
  getById: function(id, callback) {
    var filter = {
      _id: id
    };
    this.model.find(filter, callback);
  },
  updateById: function(id, update, callback) {
    var filter = {
      _id: id
    };
    this.model.find(filter).update(update, callback);
  },
  deleteById: function(id, callback) {
    var filter = {
      _id: id
    };
    this.model.find(filter).findOneAndRemove(callback);
  },
  create: function(data, callback) {
    var newModel = new this.model(data);
    newModel.save(callback);
  },
  handleErrors: function(err) {
    //console.log(err);
  }
};

BaseDAO.extend = extend;


module.exports = BaseDAO;
