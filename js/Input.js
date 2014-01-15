var Input = {}

Input.selectRect = {x:0, y:0, width:0, height:0}

Input.leftClickDown = function(e){
	Input.selectRect.x = e.pageX;
	Input.selectRect.y = e.pageY;
}

Input.leftClickUp = function(e){
	var minX = Math.min(e.pageX, Input.selectRect.x);
	var minY = Math.min(e.pageY, Input.selectRect.y);
	var maxX = Math.max(e.pageX, Input.selectRect.x);
	var maxY = Math.max(e.pageY, Input.selectRect.y);
	Input.selectRect = {x:minX,
						y:minY,
						width:maxX-minX,
						height:maxY-minY};
	connection.socket.emit('selectUnits', connection.player.selectUnits({
		rect:Input.selectRect, 
		point:new Point({x:e.pageX, y:e.pageY})
	}));
}

Input.middleClick = function(e){

}

Input.rightClick = function(e){
	connection.socket.emit('commandUnits', connection.player.commandUnits({goal:new Point({x:e.pageX, y:e.pageY})}));
}

Input.registerEvents = function(connection){
    $(window).mousedown(function(e) {
    	switch (e.which){
    		case 1: Input.leftClickDown(e); break;
    		case 2: Input.middleClick(e); break;
    		case 3: Input.rightClick(e); break;
    	}
	});
	$(window).mouseup(function(e) {
    	switch (e.which){
    		case 1: Input.leftClickUp(e); break;
    	}
    });
	window.oncontextmenu = function() {
	    return false;
	};
}

Game.classList.push(Input);

global.Input = Input;