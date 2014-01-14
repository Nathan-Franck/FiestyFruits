var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , gm = require('gm');


require('./js/Game.js')
require('./js/IdArray.js')
require('./js/Connection.js')
require('./js/Gameobject.js')
require('./js/Player.js')
require('./js/Point.js')
require('./js/Time.js')
require('./js/Unit.js')
require('./js/Graphics.js')

Game.isServer = true;

setInterval(function() {
    Game.update();
  }, 33);

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
  var player = Gameobject.list.add(new Player());
  var connection = new Connection({player:player, socket:socket, io:io});
  Game.registerEvents(connection);
});

