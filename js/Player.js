function Player (arg){
	//this.id = arg.id;
	this.onEvent = function(e) {
		console.log("Player recieved event "+this.id)
		return this;
	}
	this.asEvent = function(){
		return {id:this.id};
	}
}

Player.prototype = new Gameobject(); 

global.Player = Player;