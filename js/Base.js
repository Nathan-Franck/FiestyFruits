function Base (args) {
	for(var key in args) this[key] = args[key];
}
Base.prototype = new Unit(); 
Base.prototype.update = function() {
	//spawn units
}
Base.prototype.onEvent = function(e) {
	return prototype.onEvent(e);
}
Base.prototype.initGraphics = function() {
	prototype.initGraphics();
}
Base.prototype.asEvent = function() {
	return prototype.asEvent();
}
Base.prototype.destroy = function() {
	prototype.destroy();
}

global.Base = Base;
