var Game = {};

Game.players = new Array();//list of players
Game.units = new Array();//list of units

Game.createNewPlayer = function(){ //go through player list and create new player using id

}

Game.update = function(){ //simulate game for one tick
	Time.update();
	var i;

	//update all the units
	for (i = 0; i < Unit.list.length; i++){
		Unit.list[i].update();
	}
}
