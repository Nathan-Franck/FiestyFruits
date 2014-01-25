// the environment the game takes place in
var World = {}

World.init = function(){
	//felt play surface
	World.background = new PIXI.TilingSprite(Graphics.retrieveTexture("felt.png"), window.innerWidth, window.innerHeight);
	Graphics.stage.addChild(World.background);

	//hex grid overlay
	var size = 120;
	World.gridTexture = new PIXI.RenderTexture(size*3, size*Math.sqrt(3));
	World.grid = new PIXI.TilingSprite(World.gridTexture, window.innerWidth, window.innerHeight);
	Graphics.stage.addChild(World.grid);

	//render the hexagon
	var space = new PIXI.DisplayObjectContainer();
	var hex = new PIXI.Graphics();
	var thickness = 8;
	var extend = size - thickness/2;
	var step = Math.PI/3;
	hex.lineStyle(3, 0x111111, .1);
	hex.moveTo(Math.cos(0)*extend, Math.sin(0)*extend);
	for (var a = step; a < Math.PI*2; a += step){
		hex.lineTo(Math.cos(a)*extend, Math.sin(a)*extend);
	}	
	hex.lineStyle(thickness, 0x333333, .1);
	hex.moveTo(Math.cos(0)*extend, Math.sin(0)*extend);
	hex.lineTo(Math.cos(step)*extend, Math.sin(step)*extend);
	hex.lineTo(Math.cos(step*2)*extend, Math.sin(step*2)*extend);
	hex.lineStyle(thickness, 0x888888, .1);
	hex.moveTo(Math.cos(step*2)*extend, Math.sin(step*2)*extend);
	hex.lineTo(Math.cos(step*3)*extend, Math.sin(step*3)*extend);
	hex.lineStyle(thickness, 0xFFFFFF, .1);
	hex.moveTo(Math.cos(step*3)*extend, Math.sin(step*3)*extend);
	hex.lineTo(Math.cos(step*4)*extend, Math.sin(step*4)*extend);
	hex.lineTo(Math.cos(step*5)*extend, Math.sin(step*5)*extend);
	hex.lineStyle(thickness, 0x999999, .1);
	hex.moveTo(Math.cos(step*5)*extend, Math.sin(step*5)*extend);
	hex.lineTo(Math.cos(step*6)*extend, Math.sin(step*6)*extend);
	space.addChild(hex);

	//render the hexagons on the grid texture
	hex.position.x = size;
	hex.position.y = size*Math.sqrt(3)/2;
	World.gridTexture.render(space);
	hex.position.x = size*5/2;
	hex.position.y = 0;
	World.gridTexture.render(space);
	hex.position.x = size*5/2;
	hex.position.y = size*Math.sqrt(3);
	World.gridTexture.render(space);
	hex.position.x = -size*1/2;
	hex.position.y = 0;
	World.gridTexture.render(space);
	hex.position.x = -size*1/2;
	hex.position.y = size*Math.sqrt(3);
	World.gridTexture.render(space);
}

World.resize = function(){
	World.background.resize(window.innerWidth, window.innerHeight);
	World.grid.resize(window.innerWidth, window.innerHeight);
}

// require background texture
World.requiredTextures = {"orchard.png":{}, "grass.png":{}, "felt.png":{}};

global.World = World;