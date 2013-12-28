function Unit (arg) {
	this.position = new Point(arg.position.x, arg.position.y);
	this.goal = new Point(arg.goal.x, arg.goal.y);
	this.speed = arg.speed;
	var sprite = null;

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
		if (!Game.isServer) this.position = e.position;
		this.goal = e.goal;
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
		return {id:this.id, position:this.position, goal:this.goal};
	}
	if (Graphics.isInitialized) this.initGraphics();
}

Unit.prototype = new Gameobject(); 

global.Unit = Unit;
