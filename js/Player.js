function Player (arg){
	this.asEvent = function(){
		return {id:this.id};
	}
}

Player.prototype = new Gameobject(); 

global.Player = Player;