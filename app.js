var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

require('./js/Game.js')
require('./js/Gameobject.js')
require('./js/Player.js')
require('./js/Point.js')
require('./js/Time.js')
require('./js/Unit.js')
require('./js/Graphics.js')

Game.isServer = true;

setInterval(function() {

  }, 1000);

app.listen(1337);


function handler (req, res) {
  console.log(req.url);
  var fileName;
  if ( req.url == '/') {
    fileName = '/index.html';
  }
  else {
    fileName = req.url;
  }
  fs.readFile(__dirname + fileName,
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

io.sockets.on('connection', function (socket) {
  socket.emit('new player', Gameobject.add(new Player()));
  io.sockets.emit( 'new unit', Gameobject.add(new Unit({position:new Point(20, 20), goal:new Point(30, 30), speed:20})) );
  socket.on('update', function(data) {
    socket.broadcast.emit('update', Gameobject.list[data.id].onEvent(data).asEvent());
  });
});

