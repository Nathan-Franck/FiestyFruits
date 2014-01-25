var Game = {};

Game.isServer = false;

Game.registerAllEvents = function(connection){
	for (var key in global){
		if (global[key].hasOwnProperty("registerEvents"))
			global[key].registerEvents(connection);
	}
}

Game.update = function(){ //simulate game for one tick
	Time.update();
	Gameobject.updateAll();
}

global.Game = Game;
