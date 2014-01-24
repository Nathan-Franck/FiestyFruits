// object resposible for all visuals in game
var Graphics = {};

// initialize graphics for the game (server does not run this function)
Graphics.init = function (width, height){
	// create an new instance of a pixi stage
	Graphics.stage = new PIXI.Stage(0x66FF99);
	// create a renderer instance
	Graphics.renderer = PIXI.autoDetectRenderer(width, height);

	// add a background image
	var background = PIXI.Sprite.fromImage("img/orchard.png");
	Graphics.stage.addChild(background);

	// add the renderer view element to the DOM
	document.body.appendChild(Graphics.renderer.view);
	// create a texture from an image path
	Unit.texture = PIXI.Texture.fromImage("img/apple_stand.png");
	Graphics.isInitialized = true;
}

// gather the list of textures required from all the game objects in the global space
Graphics.compileRequiredTexturesList = function(){
	Game.requiredTextures = {};
	//go through all the global objects
	for (var key in global){
		//if there's no required textures, move on...
		if (!global[key].hasOwnProperty("requiredTextures")) continue;
		//get required textures and add to the main list
		var requiredTextures = global[key].requiredTextures;
		for (var j = 0; j < requiredTextures.length; j ++){
			Game.requiredTextures[key] = requiredTextures(requiredTextures[j]);
		}
	}
}

// render the colored textures for a given id, execute a function after rendering/loading is finished
Graphics.renderColoredTextures = function(id, func){
	var deferredCount = 0;
	// go through the required texture list
	for (var name in requiredTextures){
		// get info - address
		var texInfo = requiredTextures[name];
		if (!texInfo.colorCode) continue;
		var commonAddress = "img/";
		var address = commonAddress + id + "/";
		// try to get texture from address
		texInfo.texture = PIXI.Texture.fromImage(address+name);
		// if texture isn't there yet, make the file
		if (texInfo.texture == null){
			deferredCount ++;
			//render the texture
			gm(commonAddress+name).flip().write(address+name, function(err) {
				if(err) console.log(err);
				else texInfo.texture = PIXI.Texture.fromImage(address+name);
				//once no more deferred functions need to be executed, run the function
				if (--deferredCount <= 0) func();
			});
		}
	}
	if (deferredCount <= 0) func();
}

// redraw the game scene
Graphics.update = function(){
	Graphics.renderer.render(Graphics.stage);
}

global.Graphics = Graphics;