var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')
  , gm = require('gm');
  /*, dogecoin = require('node-dogecoin')({ // doge coin experimentation
      user: "nathan",
      pass: "gorbyporby"
  });
dogecoin.exec('getbalance', function(err, balance) {
  console.log(balance.result);
})
*/


require('./js/Game.js')
require('./js/IdArray.js')
require('./js/Connection.js')
require('./js/Gameobject.js')
require('./js/Player.js')
require('./js/World.js')
require('./js/Point.js')
require('./js/Time.js')
require('./js/Unit.js')
require('./js/Graphics.js')

Graphics.compileRequiredTexturesList();
Game.isServer = true;

setInterval(function() {
    Game.update();
}, 33);

app.listen(1337);

var blacklist = {"/app.js":true}; // any file put in here can not be requested from the client


function handler (req, res) {
  console.log(req.url);
  var fileName;
  if (blacklist.hasOwnProperty(req.url)) return res.end('Error loading '+req.url); // if this file is blacklisted, hide it from the client
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
      return res.end('Error loading '+req.url);
    }

    res.writeHead(200);
    res.end(data);
  });
}

Connection.io = io;

io.sockets.on('connection', function (socket) {
  var player = Gameobject.list.add(new Player());
  var connection = new Connection({player:player, socket:socket, io:io});
  Game.registerAllEvents(connection);
});

