var ServerGenerator = require('../ServerGenerator');
  mongoose = require('mongoose');
  dbSpec = require('../../mongo/dbSpec'),
  mSchemas = {},
  mModels = {};


  /*dbSpec.collections.forEach(function(modelName) {
      var modelSpec = dbSpec.models[modelName];
      mSchemas[modelSpec.name] = mongoose.Schema(modelSpec.schema);
      mModels[modelSpec.name] = mongoose.model(modelSpec.name,
        mSchemas[modelSpec.name]
      );
    });*/

var NotesServer = ServerGenerator.extend({
  constructor: function() {
    return this.initialize.apply(this,arguments);
  },
  initialize: function(options) {
    console.log('new ' + options.modelName + ' server');
    console.log(mongoose.connection);
    if (mongoose.connection.readyState !== 1) {
      this.isReady = false;
      mongoose.connect('mongodb://localhost:27017');
      console.log('connecting to DB...');
      mongoose.connection.on('open', function() {
        console.log('connected to DB');
        this.isReady = true;
      }.bind(this));
    }
    this.modelName = options.modelName;
    this.dbModel = dbSpec.models['notes'];
    this.schema = mongoose.Schema(this.dbModel.schema)
    this.model = mongoose.model(this.dbModel.name, this.schema);
    return NotesServer.__super__.initialize.apply(this, arguments);
  },
  optionHeaders: {
    'Access-Control-Allow-Methods': "CREATE, DELETE, UPDATE, " +
      "POST, GET, OPTIONS, PUT",
    'Access-Control-Allow-Headers': 'accept, content-type',
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': "*"
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
  createNew: function(data, callback) {
    var newModel = new this.model(data);
    newModel.save(callback);
  }
});
module.exports = NotesServer;
