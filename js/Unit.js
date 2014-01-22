function Unit (args) {
	for(var key in args) this[key] = args[key];
	this.initGraphics();
	this.position = new Point(this.position);
	this.goal = new Point(this.goal);
	this.targetID = null;
	this.health = 1;
	this.dps = 1;
	this.attackingID = null;
	this.hopLength = .4;
	this.hopHeight = 10;
	this.commandTime = 0;
	this.commandDelay = .1+.5*((this.position.x*21+this.position.y*31)%17)/17.0;
	this.hopTime = this.commandDelay;
	Gameobject.list[this.ownerID].units.push(this);
}

Unit.prototype = Object.create(Gameobject.prototype, {
    constructor: {
      value: Unit,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });

Unit.prototype.initGraphics = function() {
	if (!Graphics.isInitialized) return;
	this.sprite = new PIXI.Sprite(Unit.texture);

	// center the sprites anchor point
	this.sprite.anchor.x = 0.5;
	this.sprite.anchor.y = 0.5;

	this.sprite.position = this.position;

	Graphics.stage.addChild(this.sprite);
}

Unit.prototype.update = function() {
	var bounce = false;
	//attacking logic
	if (this.attackingID != null){
		var attacking = Gameobject.list[this.attackingID];
		if (attacking == null) this.attackingID = null;
		else {
			attacking.health -= this.dps * Time.deltaTime;
			if (Game.isServer) {
				if (attacking.health <= 0) Connection.io.sockets.emit('destroy', attacking.destroy().id);
			}
		}
	}
	else {
		//define goal as target position
		var target;
		if (this.targetID != null){
			target = Gameobject.list[this.targetID];
			if (target != null)	this.goal = target.position;
			else {
				this.targetID = null;
				this.goal = this.position;
			}
		}
		//move towards the goal
		if (Time.time-this.commandTime > this.commandDelay){
			bounce = true;
			var diff = new Point(this.goal).sub(this.position);
			var distLeft = diff.magnitude();
			var moveLength = Time.deltaTime*this.speed;
			
			
			if (target != null && distLeft < target.radius+this.radius){
				moveLength = 0;
				if (target.ownerID != this.ownerID){
					this.attackingID = target.id;
					target.attackingID = this.id;
				}
				bounce = false;
			} else if (moveLength > distLeft) {
				moveLength = distLeft;
				bounce = false;
			}
			if (distLeft > 0) this.position.add(diff.scale(moveLength/distLeft));
		}
	}
	//visuals and animation
	if (!Game.isServer){
		this.hopTime += Time.deltaTime;
		if (this.hopTime > this.hopLength) {
			if (bounce) this.hopTime -= this.hopLength;
			else this.hopTime = this.hopLength;
		}
		this.sprite.position = new Point(this.position);
		this.sprite.position.y -= Math.sin(this.hopTime/this.hopLength*Math.PI)*this.hopHeight;
	}
}

Unit.prototype.onEvent = function(e) {
	for (var key in e){
		switch(key){
			case "position": if (!Game.isServer) this.position = new Point(e.position); break;
			case "speed": if (!Game.isServer) this.speed = e.speed;
			case "goal": this.goal = new Point(e.goal); this.commandTime = Time.time; break;
			case "targetID": this.targetID = e.targetID;
			this[key] = e[key];
		}
	}
	return this;
}

Unit.prototype.asEvent = function() {
	return {id:this.id, ownerID:this.ownerID, position:this.position, goal:this.goal, speed:this.speed, radius:this.radius};
}

Unit.prototype.destroy = function() {
	if (this.sprite != null) Graphics.stage.removeChild(this.sprite);
	this.sprite = null;
	Gameobject.list[this.id] = null;
	return this;
}

Unit.registerEvents = function(connection){
	if (Game.isServer){
		for (var i = 0; i < 10; i ++){
			connection.io.sockets.emit('new unit', Gameobject.list.add(
				new Unit({position:new Point({x:20+i*10, y:20}), goal:new Point({x:20, y:20}), 
					speed:100, radius:10, ownerID:connection.player.id}))
			);
		}
	}
	else {
		connection.socket.on('new unit', function(data) {
			Gameobject.list.enlist(new Unit(data));
    	});
	}
}

Unit.requiredTextures = {"apple.png":{colorCode:true}};

global.Unit = Unit;
