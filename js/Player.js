function Player (arg){
	this.asEvent = function(){
		return {id:id};
	}
}

Player.prototype = new Gameobject(); 

global.Player = Player;