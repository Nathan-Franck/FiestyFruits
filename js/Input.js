var Input = {}

Input.dragStart = {x:0, y:0};
Input.selectRect = {x:0, y:0, width:0, height:0};
Input.gui = null;
Input.mouseDown = {left:false, middle:false, right:false};

Input.update = function(){
	Input.gui.clear();
	if (Input.mouseDown.left){
		Input.gui.lineStyle(2, 0xFFFFFF, .5);
		Input.gui.drawRect(Input.selectRect.x, Input.selectRect.y, Input.selectRect.width, Input.selectRect.height);
	}
}

Input.mouseMove = function(e){
	if (!Input.mouseDown.left) return;
	var minX = Math.min(e.pageX, Input.dragStart.x);
	var minY = Math.min(e.pageY, Input.dragStart.y);
	var maxX = Math.max(e.pageX, Input.dragStart.x);
	var maxY = Math.max(e.pageY, Input.dragStart.y);
	Input.selectRect = {x:minX,
						y:minY,
						width:maxX-minX,
						height:maxY-minY};
}

Input.leftClickDown = function(e){
	Input.mouseDown.left = true;
	Input.dragStart.x = e.pageX;
	Input.dragStart.y = e.pageY;
	Input.selectRect.x = e.pageX;
	Input.selectRect.y = e.pageY;
	Input.selectRect.width = 0;
	Input.selectRect.height = 0;
}

Input.leftClickUp = function(e){
	Input.mouseDown.left = false;
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
    $(window).mousemove(function(e){Input.mouseMove(e)});
	window.oncontextmenu = function() {
	    return false;
	};

	Input.gui = new PIXI.Graphics();
	Graphics.stage.addChild(Input.gui);
}

Game.classList.push(Input);

global.Input = Input;