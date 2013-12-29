function Player (arg){
	this.onEvent = function(e) {
		return this;
	}
	this.asEvent = function(){
		return {id:this.id};
	}
	this.destroy = function(){
		for (var i in Gameobject.list){
			if (Gameobject.list[i] == null) continue;
			if (Gameobject.list[i].hasOwnProperty("ownerID") && Gameobject.list[i].ownerID == this.id) Gameobject.list[i].destroy();
		}
		Gameobject.list[this.id] = null;
	}
	if (arg == null) return;
	this.id = arg.hasOwnProperty("id")?arg.id:0;
}

Player.prototype = new Gameobject(); 

global.Player = Player;