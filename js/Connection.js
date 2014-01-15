function Connection(args){
	this.player = null;
	this.socket = null;
	this.io = null;
	for(var key in args) this[key] = args[key];
}

global.Connection = Connection;