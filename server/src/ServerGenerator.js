var url = require('url'),
  path = require('path'),
  mongoose = require('mongoose'),
  dbSpec = require('../mongo/dbSpec');


function ServerGenerator() {
  return this.initialize.apply(this, arguments);
}

ServerGenerator.prototype = {
  initialize: function(options) {
    console.log('new ' + options.modelName + ' server.');
    this.modelName = options.modelName;
    this.dbModel = dbSpec.models[this.modelName];
    this.schema = new mongoose.Schema(this.dbModel.schema);
    if (mongoose.modelNames().indexOf(this.dbModel.name) === -1) {
      this.model = mongoose.model(this.dbModel.name, this.schema);
    } else {
      this.model = mongoose.model(this.dbModel.name);
      console.log('model exists', this.model);
    }
    return this;
  },
  createServer: function() {
    return this.server;
  },
  loadRequest: function(req, callback) {
    var data = '';
    req.on('data', function (buff) {
      data += buff.toString();
    });
    req.once('end', function() {
      callback(req, JSON.parse(data||"{}"));
    });
  },
  defaultGatherData: function(req, reqData, callback) {
    this.getCollection(function(err, models) {
      callback(err, {
        headCode: 200,
        headers: serverGen.successHeaders,
        write: JSON.stringify(models)
      });
    });
  },
  optionHeaders: {
    'Access-Control-Allow-Methods': "CREATE, DELETE, UPDATE, " +
      "POST, GET, OPTIONS, PUT",
    'Access-Control-Allow-Headers': 'accept, content-type',
    'Accept': '*/*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': "*"
  },
  successHeaders: {
    'Access-Control-Allow-Origin': "*",
    'Content-Type': 'application/json'
  },
  preRespHook: function() {
    return this;
  },
  handleErrs: function(err) {
    if (err) this.errors.push(err);
    console.log(this.errors.join('\n'));
  },
  isReady: true,
  isValidRequest: function() {
    return true;
  },
  errors: [],
  serve: function(gatherDataFn) {
    return (function(req, resp) {
      if (this.isReady) {
        this.preRespHook(req, resp)
        .loadRequest(req, function(err, data) {
          if (err) {
            this.handleErrs(err);
          } else {
            gatherDataFn = gatherDataFn || this.defaultGatherData;
            gatherDataFn(req, data, function(err, data) {
              if (err) {
                this.handleErrs(err);
              } else {
                this.respondWith(resp, data);
              }
            }.bind(this));
          }
        }.bind(this));
      } else {
        resp.end();
        this.handleErrs("I'm not ready");
      }
    }.bind(this));
  },
  respondWith: function(resp, data) {
    resp.writeHead(data.headCode, data.headers);
    resp.write(data.write);
    resp.end();
    if (data.console) {
      console.log(data.console);
    }
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
};

ServerGenerator.extend = require('./extend');

module.exports = ServerGenerator;
