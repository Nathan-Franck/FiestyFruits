function Player (args){
	this.local = false;
	this.selection = new Array();
	this.units = new Array();
	this.connection = null;
	for(var key in args) this[key] = args[key];
	if (this.connection != null) this.connection.player = this;
}

Player.prototype = new Gameobject(); 

Player.prototype.onCreate = function(e) {
	Player.list.enlist(this);
}
Player.prototype.onEvent = function(e) {
	return this;
}
Player.prototype.asEvent = function(){
	return {id:this.id};
}
Player.prototype.destroy = function(){
	for (var i in Gameobject.list){
		if (Gameobject.list[i] == null) continue;
		if (Gameobject.list[i].hasOwnProperty("ownerID") && Gameobject.list[i].ownerID == this.id) Gameobject.list[i].destroy();
	}
	Gameobject.list[this.id] = null;
}
Player.prototype.commandUnits = function(e) {
	e.id = this.id;
	if (this.selection == null || this.selection.length == 0) return e;
	if (this.local){
		var intersection = Gameobject.intersection({point:e.goal});
		if (intersection.length > 0) e.targetID = intersection[0].id;
	}
	var spacing = 40;
	//old squarer formation
	/*var side = Math.sqrt(this.selection.length);
	for(var i = 0; i < this.selection.length; i ++){
		var unit = Gameobject.list[this.selection[i]];
		if (unit == null || unit.ownerID != this.id) continue;
		var e2 = {};
		var y = Math.floor(i/Math.ceil(side));
		var x = Math.floor(i%Math.ceil(side));
		if (y%2 == 1) x += .5;
		x -= side/2.0-.5;
		y -= side/2.0-.5;
		e2.goal = new Point(e.goal).add(new Point({x:x, y:y}).scale(spacing));
		e2.targetID = e.targetID;
		unit.onEvent(e2);
	}*/
	//hexagon formation (works great for same-sided formations)
	var selectedID = 0;
	var side = (Math.sqrt(12*this.selection.length-3)-3)/6+1; //define the side size of the hexagon based on the number of units
	if (side-Math.floor(side) <= 0) { //if the hexagon will form perfectly, use this algorithm
		//fill the hexagon with units until no more units
		for (var y = 0; y < side*2-1; y++){
			console.log(y);
			var rowSize = Math.min(side+y, side*3-2-y);
			var offset = (rowSize - 1)/2.0;
			for (var x = -offset; x <= offset; x ++){
				console.log("x: "+x);
				//get next unit
				var unit = null;
				//while (unit == null || unit.ownerID != this.id) {
					if (selectedID >= this.selection.Length) return e;
					unit = Gameobject.list[this.selection[selectedID++]];
				//}
				if (unit == null || unit.ownerID != this.id) continue;//temp
				//set the unit's goal
				var data = {};
				data.goal = new Point(e.goal).add(new Point({x:x, y:y-side+1}).scale(spacing));
				data.targetID = e.targetID;
				unit.onEvent(data);
			}
		}
	}
	else {
		//hexagon formation v2 (works great for uneven-sided formations)
		var up = true;
		var r = 0;
		var angle = 0;
		var offset = 0;
		var point = new Point({x:0, y:0});
		var unit = Gameobject.list[this.selection[selectedID++]];
		for (var i = 0; true; i ++){//layers of triangle
			if (i%2) {
				offset = 0.25;
				r = spacing/Math.sqrt(12);
			} else {
				offset = 0.75;
				r = spacing/Math.sqrt(3);
			}
			x = Math.floor((i + 1)/2.0);
			r += x*spacing*Math.sqrt(3)/2;
			for (var t = offset; t < 3; t ++){//triangle sides
				angle = t*2*Math.PI/3.0;
				side = Math.floor(i/2)+1;
				point.x = Math.cos(angle)*r;
				point.y = Math.sin(angle)*r;
				var maxDisp = (side-1)/2.0*spacing;
				for (var y = -maxDisp; y <= maxDisp; y += spacing){//side
					var pos = new Point(point);
					pos.x -= Math.sin(angle)*y;
					pos.y += Math.cos(angle)*y;
					//set the unit's goal
					unit.onEvent({goal:new Point(e.goal).add(pos), targetID:e.targetID});
					//get next unit
					unit = Gameobject.list[this.selection[selectedID++]];
					if (selectedID >= this.selection.Length) return e;
				}
			}
		}
	}
	return e;
}

Player.prototype.selectUnits = function(e) {
	if (this.local){
		var intersection = null;
		if (e.hasOwnProperty("rect")) intersection = Gameobject.intersection({rect:e.rect});
		if (e.hasOwnProperty("point") && intersection.length == 0)
			intersection = Gameobject.intersection({point:e.point});
		if (intersection.length > 0) {
			e.selection = [];
			for (var i = 0; i < intersection.length; i ++){
				if (intersection[i].ownerID != this.id) continue;
				e.selection.push(intersection[i].id);
			}
		}
	}
	this.selection = e.selection;
	e.id = this.id;
	return e;
}

Player.list = new IdArray("playerId");

Player.registerEvents = function(connection){
	if (Game.isServer){
		connection.socket.emit('assign player', connection.player.asEvent());
  		connection.socket.broadcast.emit('new player', connection.player.asEvent());
		connection.socket.on('disconnect', function() {
			connection.socket.broadcast.emit('destroy', connection.player.asEvent());
			connection.player.destroy();
		})
	}
	else {
	    connection.socket.on('assign player', function(data) {
	    	connection.player = new Player(data);
	    	connection.player.local = true;
	    	connection.player.connection = connection;
	    	Gameobject.list.enlist(connection.player);
	    });
	    connection.socket.on('new player', function(data) {
	    	Gameobject.list.enlist(new Player(data));
	    });
	}

	connection.socket.on('commandUnits', function(data) {
		var o = Gameobject.list[data.id];
		if (!Game.isServer || o == connection.player) {
			o.commandUnits(data);
			if (Game.isServer) connection.socket.broadcast.emit('commandUnits', data);
		}
	});
	connection.socket.on('selectUnits', function(data) {
		var o = Gameobject.list[data.id];
		if (!Game.isServer || o == connection.player) {
			o.selectUnits(data);
			if (Game.isServer) connection.socket.broadcast.emit('selectUnits', data);
		}
	});
}

global.Player = Player;