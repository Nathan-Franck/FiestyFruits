var Game = {};

Game.isServer = false;

Game.update = function(){ //simulate game for one tick
	Time.update();
	var i;
	Gameobject.updateAll();
}

global.Game = Game;
