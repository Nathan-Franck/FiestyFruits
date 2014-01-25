//player associated with each connecting client, has a list of units, can select and command units`
function Player (args){
	this.local = false;
	this.selection = new Array();
	this.units = new Array();
	this.connection = null;
	if (Game.isServer) Player.list.add(this);
	for(var key in args) this[key] = args[key];
	if (this.connection != null) this.connection.player = this;
}

//inherits from gameobject
Player.prototype = new Gameobject(); 

//when created, add it to the player list
Player.prototype.onCreate = function(e) {
	Player.list.enlist(this);
}
//handle event
Player.prototype.onEvent = function(e) {
	return this;
}
//send vital information
Player.prototype.asEvent = function(){
	return {id:this.id, playerID:this.playerID};
}
//when player is destroyed, destroy all the units the player owns
Player.prototype.destroy = function(){
	for (var i in Gameobject.list){
		if (Gameobject.list[i] == null) continue;
		if (Gameobject.list[i].hasOwnProperty("ownerID") && Gameobject.list[i].ownerID == this.id) Gameobject.list[i].destroy();
	}
	Gameobject.list[this.id] = null;
	Player.list[this.id] = null;
}
//called when mouse clicks - tells units to go somewhere
Player.prototype.commandUnits = function(e) {
	e.id = this.id;
	//if there's nothing selected, return immediately
	if (this.selection == null || this.selection.length == 0) return e;
	//if this is the client's click, see if there's a unit to target (expensive [which is why it's only on the client])
	if (this.local){
		var intersection = Gameobject.intersection({point:e.goal});
		if (intersection.length > 0) e.targetID = intersection[0].id;
	}
	//hexagon formation (works great for same-sided formations)
	var spacing = 40;
	var selectedID = 0;
	var unit = Gameobject.list[this.selection[selectedID++]];
	var side = (Math.sqrt(12*this.selection.length-3)-3)/6+1; //define the side size of the hexagon based on the number of units
	if (side-Math.floor(side) <= 0) { //if the hexagon will form perfectly, use this algorithm
		//fill the hexagon with units until no more units
		for (var y = 0; y < side*2-1; y++){
			var rowSize = Math.min(side+y, side*3-2-y);
			var offset = (rowSize - 1)/2.0;
			for (var x = -offset; x <= offset; x ++){
				//command unit
				unit.onEvent({
					goal: new Point(e.goal).add(new Point({x:x, y:y*Math.sqrt(3)/2-side+1}).scale(spacing)),
					targetID: e.targetID
				});
				//get next unit
				unit = null;
				while (unit == null && selectedID < this.selection.length) unit = Gameobject.list[this.selection[selectedID++]];
				if (unit == null && selectedID >= this.selection.length) return e;
			}
		}
	}
	else {
		//hexagon formation v2 (works great for uneven-sided formations)
		//basically adds units in a rough triangle formation spiralling outwards forming a hexagonal shape
		var up = true;
		var r = 0;
		var angle = 0;
		var offset = 0;
		var point = new Point({x:0, y:0});
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
					//command unit
					if (unit != null) unit.onEvent({goal:new Point(e.goal).add(pos), targetID:e.targetID});
					//get next unit
					unit = null;
					while (unit == null && selectedID < this.selection.length) unit = Gameobject.list[this.selection[selectedID++]];
					if (unit == null && selectedID >= this.selection.length) return e;
				}
			}
		}
	}
	return e;
}

//box/point select of units
//if no unit is captured by box select, try point select
Player.prototype.selectUnits = function(e) {
	if (this.local){
		var intersection = null;
		//rectangle check
		if (e.hasOwnProperty("rect")) intersection = Gameobject.intersection({rect:e.rect});
		//point check
		if (e.hasOwnProperty("point") && intersection.length == 0)
			intersection = Gameobject.intersection({point:e.point});
		//check if selected units are owned by this player or not (should probably do this check earlier in the future)
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

//list of all players
Player.list = new IdArray("playerID");

//register events 
Player.registerEvents = function(connection){
	//game server assigns new player on initial connect
	if (Game.isServer){
		connection.socket.emit('assign player', connection.player.asEvent());
  		connection.socket.broadcast.emit('new player', connection.player.asEvent());
  		//when player disconnected, destroy the player object
		connection.socket.on('disconnect', function() {
			connection.socket.broadcast.emit('destroy', connection.player.id);
			connection.player.destroy();
		})
	}
	//client events
	else {
		//get assigned player
	    connection.socket.on('assign player', function(data) {
	    	connection.player = new Player(data);
	    	connection.player.local = true;
	    	connection.player.connection = connection;
	    	Gameobject.list.enlist(connection.player);
	    });
	    //acknowledge other new player
	    connection.socket.on('new player', function(data) {
	    	Gameobject.list.enlist(new Player(data));
	    });
	    //when server disconnects, remove all gameobjects entirely
	    connection.socket.on('disconnect', function() {
	    	for (var i = 0; i < Gameobject.list.length; i ++){
	    		if (Gameobject.list[i] != null) Gameobject.list[i].destroy();
	    	}
	    });
	}

	//unit commands done per player, not per unit to lower bandwidth
	connection.socket.on('commandUnits', function(data) {
		var o = Gameobject.list[data.id];
		if (!Game.isServer || o == connection.player) {
			o.commandUnits(data);
			if (Game.isServer) connection.socket.broadcast.emit('commandUnits', data);
		}
	});
	//selecting units comes across the network for unit commanding to work properly
	connection.socket.on('selectUnits', function(data) {
		var o = Gameobject.list[data.id];
		if (!Game.isServer || o == connection.player) {
			o.selectUnits(data);
			if (Game.isServer) connection.socket.broadcast.emit('selectUnits', data);
		}
	});
}

global.Player = Player;