function Unit (arg) {
	this.id = arg.id;
	this.position = arg.position;
	this.goal = arg.goal;
	this.speed = 20;
	this.sprite = null;

	this.update = function() {
		this.position.add(
			new Point().init(this.goal)
			.sub(this.position).normalize()
			//*Time.deltaTime*this.speed
		);//
		//console.log(new Point().init(this.position).normalize().getInfo());
	}
	this.onEvent = function(e) {
		if (!Game.isServer) this.position = e.position;
		this.goal = e.goal;
	}
	this.initGraphics = function() {
		this.sprite = new PIXI.Sprite(Unit.texture);
	
		// center the sprites anchor point
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;

		this.sprite.position = this.position;

		Graphics.stage.addChild(this.sprite);
	}
	if (Graphics.isInitialized) this.initGraphics();
}

Unit.list = new Array();

Unit.create = function(){ //create new unit
	var i;	
	var unit = new Unit({id:i, position:new Point(20, 20), goal:new Point(200, 200)});
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
	while (Unit.list.length <= unit.id) {
		Unit.list.push(null);
	}
	Unit.list[unit.id] = unit;
	return unit;
}

global.Unit = Unit;
