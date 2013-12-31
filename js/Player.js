function Player (arg){

	this.onCreate = function(e) {
		Player.add(this);
	}
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
	this.selection = new Array();
	this.playerId = 0;
}

Player.list = new Array();

Player.add = function(player){ //create new player
	var i;
	//loop through existing list
	for (i = 0; i < Player.list.length; i++){
		if (Player.list[i] == null){
			Player.list[i] = player;
			player.playerId = i;
			return player;
		}
	}
	//or tack onto end of list
	player.playerId = Player.list.length;
	Player.list.push(player);
	return player;
}

Player.enlist = function(player){
	while (Player.list.length <= player.playerId) {
		Player.list.push(null);
	}
	Player.list[player.playerId] = player;
	return player;
}

Player.prototype = new Gameobject(); 

global.Player = Player;