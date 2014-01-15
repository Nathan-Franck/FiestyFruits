var Input = {}

Input.registerEvents = function(connection){
    $(window).mousedown(function(e) {
		connection.socket.emit('commandUnits', connection.player.commandUnits({goal:{x:e.pageX, y:e.pageY}}));
	});
}

Game.classList.push(Input);

global.Input = Input;