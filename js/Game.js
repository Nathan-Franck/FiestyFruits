function Game (){
	var players = {}//list of players
	var units = {}//list of units
}

Game.createNewPlayer = function(){ //go through player list and create new player using id

}

Game.createNewUnit = function(){ //create new unit
	var created = false;
	var i;	
	var unit = new Unit(i, new Point(0, 0), new Point(0, 0));
	//loop through existing list
	for (i = 0; i < units.length; i++){
		if (units[i] == null){
			units[i] = unit;
			created = true;
		}
	}
	//or tack onto end of list
	if (!created) units.Push(unit);
}

Game.update = function(){ //simulate game for one tick
	Time.update();
	var i;

	//update all the units
	for (i = 0; i < units.length; i++){
		units[i].update();
	}
}
