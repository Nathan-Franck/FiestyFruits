function Unit (id, position, goal) {
	this.id = id;
	this.position = position;
	this.goal = goal;
	this.speed = 20;

	this.update = function() {
		this.position.add(
			new Point().init(this.goal)
			.sub(this.position).normalize()
			//*Time.deltaTime*this.speed
		);//
		//console.log(new Point().init(this.position).normalize().getInfo());
	}
}

Unit.list = new Array();

Unit.create = function(){ //create new unit
	var i;	
	var unit = new Unit(i, new Point(20, 20), new Point(200, 200));
	console.log(unit.position.getInfo());
	//loop through existing list
	for (i = 0; i < Unit.list.length; i++){
		if (Unit.list[i] == null){
			Unit.list[i] = unit;
			return;
		}
	}
	//or tack onto end of list
	Unit.list.push(unit);
	return unit;
}

Unit.enlist = function(unit){
	Unit.list[unit.id] = unit;
}

global.Unit = Unit;
