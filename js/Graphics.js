var Graphics = {};

Graphics.init = function (width, height){
	// create an new instance of a pixi stage
	Graphics.stage = new PIXI.Stage(0x66FF99);
	// create a renderer instance
	Graphics.renderer = PIXI.autoDetectRenderer(width, height);
	// add the renderer view element to the DOM
	document.body.appendChild(Graphics.renderer.view);
	// create a texture from an image path
	Unit.texture = PIXI.Texture.fromImage("img/bunny.png");
	Graphics.isInitialized = true;
}

Graphics.update = function(){
	Graphics.renderer.render(Graphics.stage);
}

global.Graphics = Graphics;