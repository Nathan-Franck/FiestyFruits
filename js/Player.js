function Player (arg){
	this.onEvent = function(e) {
		return this;
	}
	this.asEvent = function(){
		return {id:this.id};
	}
	if (arg == null) return;
	this.id = arg.hasOwnProperty("id")?arg.id:0;
}

Player.prototype = new Gameobject(); 

global.Player = Player;