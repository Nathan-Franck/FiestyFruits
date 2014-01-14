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

global.Player = Player;