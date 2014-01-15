function Gameobject (args) {
	for(var key in args) this[key] = args[key];
}

Gameobject.prototype.update = function() {
}
Gameobject.prototype.onCreate = function(e) {
	return this;
}
Gameobject.prototype.onEvent = function(e) {
	return this;
}
Gameobject.prototype.asEvent = function() {
	return {id:this.id};
}
Gameobject.prototype.destroy = function() {
	Gameobject.list[this.id] = null;
}

Gameobject.list = new IdArray("id");

Gameobject.updateAll = function(){
	for (i = 0; i < Gameobject.list.length; i++){
		if (Gameobject.list[i] != null) Gameobject.list[i].update();
	}
}

Gameobject.registerEvents = function(connection){
	if (Game.isServer){
		//relay current game state
		for (var i in Gameobject.list){
			var g = Gameobject.list[i];
			if (g == null) continue;
			if (g instanceof Unit) connection.socket.emit('new unit', g.asEvent());
			if (g instanceof Player) connection.socket.emit('new player', g.asEvent());
			//if (g instanceof Base) socket.emit('new base', g);
		}
	}
	connection.socket.on('update', function(data) {
		if (Game.isServer) if (connection.player.id != data.ownerID) return;
		var o = Gameobject.list[data.id];
		if (o != null) o.onEvent(data);
		if (Game.isServer) connection.socket.broadcast.emit('update', o.asEvent());
	})
}

Game.classList.push(Gameobject);

global.Gameobject = Gameobject;
