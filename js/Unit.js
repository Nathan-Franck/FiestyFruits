function Unit (arg) {
	this.update = function() {
		this.position.add(
			new Point().init(this.goal)
			.sub(this.position).normalize()
			.scale(Time.deltaTime*this.speed)
		);
		//console.log(this.speed+" "+Time.deltaTime);
		if (this.sprite != null){
			this.sprite.position = this.position;
		}
	}
	this.onEvent = function(e) {
		if (!Game.isServer) this.position = new Point(e.position);
		this.goal = new Point(e.goal);
		return this;
	}
	this.initGraphics = function() {
		this.sprite = new PIXI.Sprite(Unit.texture);

		// center the sprites anchor point
		this.sprite.anchor.x = 0.5;
		this.sprite.anchor.y = 0.5;

		this.sprite.position = this.position;

		Graphics.stage.addChild(this.sprite);
	}
	this.asEvent = function() {
		return {id:this.id, ownerID:this.ownerID, position:this.position, goal:this.goal};
	}
	this.destroy = function() {
		if (this.sprite != null) Graphics.stage.removeChild(this.sprite);
		this.sprite = null;
		Gameobject.list[this.id] = null;
	}
	var sprite = null;
	if (Graphics.isInitialized) this.initGraphics();

	if (arg == null) return;
	this.id = arg.hasOwnProperty("id")?arg.id:0;
	this.ownerID = arg.hasOwnProperty("ownerID")?arg.ownerID:0;
	this.position = arg.hasOwnProperty("position")?new Point(arg.position):new Point(50, 50);
	this.goal = arg.hasOwnProperty("goal")?new Point(arg.goal):new Point(100, 100);
	this.speed = arg.hasOwnProperty("speed")?arg.speed:20;
}

Unit.registerEvents = function(connection){
	if (Game.isServer){
		for (var i = 0; i < 10; i ++){
			connection.io.sockets.emit('new unit', Gameobject.list.add(
				new Unit({position:new Point({x:20+i*10, y:20}), goal:new Point({x:20, y:20}), 
					speed:20, ownerID:connection.player.id})) 
			);
		}
	}
	else {
		connection.socket.on('new unit', function(data) {
			Gameobject.list.enlist(new Unit(data));
    	});
	}
}

Game.classList.push(Unit);

Unit.prototype = new Gameobject(); 

global.Unit = Unit;
