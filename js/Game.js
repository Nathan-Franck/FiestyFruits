var Game = {};

Game.players = new Array();//list of players
Game.units = new Array();//list of units

Game.createNewPlayer = function(){ //go through player list and create new player using id

}

Game.createNewUnit = function(){ //create new unit
	var created = false;
	var i;	
	var unit = new Unit(i, new Point(20, 20), new Point(200, 200));
	console.log(unit.position.getInfo());
	//loop through existing list
	for (i = 0; i < this.units.length; i++){
		if (this.units[i] == null){
			this.units[i] = unit;
			created = true;
		}
	}
	//or tack onto end of list
	if (!created) this.units.push(unit);
}

Game.update = function(){ //simulate game for one tick
	Time.update();
	var i;

	//update all the units
	for (i = 0; i < this.units.length; i++){
		this.units[i].update();
	}
}
