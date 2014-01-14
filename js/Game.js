var Game = {};

Game.isServer = false;

Game.registerEvents = function(connection){
	for (var i = 0; i < Game.classList.length; i ++){
		if (Game.classList[i].hasOwnProperty("registerEvents"))
			Game.classList[i].registerEvents(connection);
	}
}

Game.update = function(){ //simulate game for one tick
	Time.update();
	Gameobject.updateAll();
}

Game.classList = new Array();

global.Game = Game;
