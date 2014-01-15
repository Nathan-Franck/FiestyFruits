function Player (arg){
	this.local = false;
	this.selection = new Array();
	this.units = new Array();
	if (arg == null) return;
	this.id = arg.hasOwnProperty("id")?arg.id:0;
	this.playerId = arg.hasOwnProperty("playerId")?arg.playerId:-1;
}

Player.prototype = new Gameobject(); 

Player.prototype.onCreate = function(e) {
	Player.list.enlist(this);
}
Player.prototype.onEvent = function(e) {
	return this;
}
Player.prototype.asEvent = function(){
	return {id:this.id};
}
Player.prototype.destroy = function(){
	for (var i in Gameobject.list){
		if (Gameobject.list[i] == null) continue;
		if (Gameobject.list[i].hasOwnProperty("ownerID") && Gameobject.list[i].ownerID == this.id) Gameobject.list[i].destroy();
	}
	Gameobject.list[this.id] = null;
}
Player.prototype.commandUnits = function(e) {
	var spacing = 40;
	var side = Math.floor(Math.sqrt(this.units.length));
	for(var i = 0; i < this.units.length; i ++){
		var e2 = {};
		var x = Math.floor(i/side);
		var y = Math.floor(i%side);
		if (y%2 == 1) x += .5;
		e2.goal = new Point(e.goal).add(new Point({x:x, y:y}).scale(spacing));
		this.units[i].onEvent(e2);
	}
	e.id = this.id;
	return e;
}

Player.list = new IdArray("playerId");

Player.registerEvents = function(connection){
	if (Game.isServer){
		connection.socket.emit('assign player', connection.player.asEvent());
  		connection.socket.broadcast.emit('new player', connection.player.asEvent());
		connection.socket.on('disconnect', function() {
			connection.socket.broadcast.emit('remove player', connection.player.asEvent());
			connection.player.destroy();
		})
	}
	else {
	    connection.socket.on('assign player', function(data) {
	    	connection.player = new Player(data);
	    	connection.player.local = true;
	    	Gameobject.list.enlist(connection.player);
	    });
	    connection.socket.on('remove player', function(data) {
	    	Gameobject.list[data.id].destroy();
	    })
	    connection.socket.on('new player', function(data) {
	    	Gameobject.list.enlist(new Player(data));
	    });
	}

	connection.socket.on('commandUnits', function(data) {
		var o = Gameobject.list[data.id];
		if (!Game.isServer || o == connection.player) {
			o.commandUnits(data);
			if (Game.isServer) connection.socket.broadcast.emit('commandUnits', data);
		}
	});
}

Game.classList.push(Player);

global.Player = Player;