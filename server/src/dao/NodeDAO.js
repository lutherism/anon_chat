var mongoose = require('mongoose'),
  BaseDAO = require('./BaseDAO');

var NodeDAO = BaseDAO.extend({

});

module.exports = new NodeDAO({
  modelName: 'node'
});
