function Connection(args){
	this.player = null;
	this.socket = null;
	for(var key in args) this[key] = args[key];
	if (this.player != null) this.player.connection = this;
}

Connection.io = null

global.Connection = Connection;