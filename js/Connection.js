function Connection(args){
	this.player = null;
	this.socket = null;
	this.io = null;

	if (args == null) return;
	if (args.hasOwnProperty("player")) this.player = args.player;
	if (args.hasOwnProperty("socket")) this.socket = args.socket;
	if (args.hasOwnProperty("io")) this.io = args.io;
}

global.Connection = Connection;