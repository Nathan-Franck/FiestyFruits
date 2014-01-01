function Base (arg) {
	this.update = function() {
		//spawn units
	}
	this.onEvent = function(e) {
		return prototype.onEvent(e);
	}
	this.initGraphics = function() {
		prototype.initGraphics();
	}
	this.asEvent = function() {
		return prototype.asEvent();
	}
	this.destroy = function() {
		prototype.destroy();
	}
}

Base.prototype = new Unit(); 

global.Base = Base;
