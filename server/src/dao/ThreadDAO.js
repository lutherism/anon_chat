var BaseDAO = require('./BaseDAO');

var ThreadDAO = BaseDAO.extend({

});

module.exports = new ThreadDAO({
  modelName: 'thread'
});
