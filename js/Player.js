function Player (arg){
	if (arg == null) return;
	this.id = arg.hasOwnProperty("id")?arg.id:0;
	this.selection = new Array();
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
	    	Gameobject.list.enlist(connection.player);
	    });
	    connection.socket.on('remove player', function(data) {
	    	Gameobject.list[data.id].destroy();
	    })
	    connection.socket.on('new player', function(data) {
	    	Gameobject.list.enlist(new Player(data));
	    });
        $(window).mousedown(function(e) {
			for (var i = 0; i < Gameobject.list.length; ++i) {
				if ( Gameobject.list[i] != null 
					&& Gameobject.list[i].hasOwnProperty("goal") 
					&& Gameobject.list[i].ownerID == connection.player.id ) {
					Gameobject.list[i].goal.x = e.pageX;
					Gameobject.list[i].goal.y = e.pageY;
					connection.socket.emit('update', Gameobject.list[i].asEvent());       
				}
			}
		});
	}
}

Game.classList.push(Player);

global.Player = Player;