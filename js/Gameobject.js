function Gameobject (arg) {
	this.id = 0;//arg.id;
	this.update = function() {
	}
	this.onCreate = function(e) {
		return this;
	}
	this.onEvent = function(e) {
		return this;
	}
	this.asEvent = function() {
		return {id:this.id};
	}
	this.destroy = function() {
		Gameobject.list[this.id] = null;
	}
}

Gameobject.list = new IdArray("id");

Gameobject.updateAll = function(){
	for (i = 0; i < Gameobject.list.length; i++){
		if (Gameobject.list[i] != null) Gameobject.list[i].update();
	}
}

global.Gameobject = Gameobject;
