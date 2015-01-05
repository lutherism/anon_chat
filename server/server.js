var http = require("http"),
  sys = require("sys"),
  my_servers = require("./src/main"),
  mongoose = require('mongoose');


//ASSET SERVER
http.createServer(my_servers.newServer()).listen(8000);
sys.puts("Asset server running: http://localhost:8000");


//API + DATABASE SERVER
mongoose.connect('mongodb://localhost:27017');
console.log('connecting to DB...');
mongoose.connection.on('open', function() {
  console.log('connected to DB');
  http.createServer(my_servers.newApiServer()).listen(8008);
  sys.puts("Api server running: http://localhost:8008");
});

//SOCKET IO STREAMS
var io = require('socket.io')(http);

io.on('connection', function(socket) {
  console.log('a user connected');
  socket.on('data', function(payload) {

  });
});
