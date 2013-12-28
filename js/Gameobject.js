function Gameobject (arg) {
	this.id = 0;//arg.id;
	this.update = function() {
	}
	this.onEvent = function(e) {
	}
	this.asEvent = function() {
	}
}

Gameobject.list = new Array();

Gameobject.add = function(gameobject){ //create new gameobject
	var i;
	//loop through existing list
	for (i = 0; i < Gameobject.list.length; i++){
		if (Gameobject.list[i] == null){
			Gameobject.list[i] = gameobject;
			gameobject.id = i;
			return;
		}
	}
	//or tack onto end of list
	gameobject.id = Gameobject.list.length;
	Gameobject.list.push(gameobject);
	return gameobject;
}

Gameobject.enlist = function(gameobject){
	while (Gameobject.list.length <= gameobject.id) {
		Gameobject.list.push(null);
	}
	Gameobject.list[gameobject.id] = gameobject;
	return gameobject;
}

Gameobject.updateAll = function(){
	for (i = 0; i < Gameobject.list.length; i++){
		if (Gameobject.list[i] != null) Gameobject.list[i].update();
	}
}

global.Gameobject = Gameobject;
