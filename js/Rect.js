function Rect(args){
	this.x = 0;
	this.y = 0;
	this.width = 0;
	this.height = 0;
	for (var key in args) this[key] = args[key];
}

