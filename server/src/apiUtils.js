
var apiUtils = {
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
  loadRequest: function(req, callback) {
    var data = '';
    req.on('data', function (buff) {
      data += buff.toString();
    });
    req.once('end', function() {
      callback(req, JSON.parse(data||"{}"));
    });
  }
};

module.exports = apiUtils;
