var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , gm = require('gm');


require('./js/Game.js')
require('./js/IdArray.js')
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
  console.log(player);
  socket.emit('assign player', player.asEvent());
  io.sockets.emit('new player', player.asEvent());

  //relay current game state
  for (var i in Gameobject.list){
    var g = Gameobject.list[i];
    if (g == null) continue;
    if (g instanceof Unit) socket.emit('new unit', g.asEvent());
    if (g instanceof Player) socket.emit('new player', g.asEvent());
    //if (g instanceof Base) socket.emit('new base', g);
  }

  for (var i = 0; i < 30; i ++){
    io.sockets.emit( 'new unit', Gameobject.list.add(
      new Unit({position:new Point({x:20+i*10, y:20}), goal:new Point({x:20, y:20}), speed:20, ownerID:player.id})) 
    );
  }
  socket.on('update', function(data) {
    if (player.id != data.ownerID) return;
    socket.broadcast.emit('update', Gameobject.list[data.id].onEvent(data).asEvent());
  });

  socket.on('disconnect', function() {
    socket.broadcast.emit('remove player', player.asEvent());
    player.destroy();
    player = null;
  })
});

