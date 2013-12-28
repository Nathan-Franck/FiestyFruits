var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs');

require('./js/Game.js')
require('./js/Player.js')
require('./js/Point.js')
require('./js/Time.js')
require('./js/Unit.js')

console.log('The Game Has Begun!');
setInterval(function() {
  console.log('Next Frame!');
  }, 1000);

app.listen(1337);


function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
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
  Unit.create();
  console.log("Unit X Pos: " + Unit.list[0].position.x);
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

