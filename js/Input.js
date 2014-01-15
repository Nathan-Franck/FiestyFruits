var Input = {}

Input.leftClick = function(e){
	
}

Input.middleClick = function(e){

}

Input.rightClick = function(e){
	connection.socket.emit('commandUnits', connection.player.commandUnits({goal:new Point({x:e.pageX, y:e.pageY})}));
}

Input.registerEvents = function(connection){
    $(window).mousedown(function(e) {
    	switch (e.which){
    		case 1: Input.leftClick(e); break;
    		case 2: Input.middleClick(e); break;
    		case 3: Input.rightClick(e); break;
    	}
	});
	window.oncontextmenu = function() {
	    return false;
	};
}

Game.classList.push(Input);

global.Input = Input;