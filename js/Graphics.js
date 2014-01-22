var Graphics = {};

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

Graphics.compileRequiredTexturesList = function(){
	Game.requiredTextures = {};
	for (var key in global){
		if (!global[key].hasOwnProperty("requiredTextures")) continue;
		var requiredTextures = global[key].requiredTextures;
		for (var j = 0; j < requiredTextures.length; j ++){
			Game.requiredTextures[key] = requiredTextures(requiredTextures[j]);
		}
	}
	console.log(Game.requiredTextures)
}

Graphics.renderColoredTextures = function(id, func){
	var deferredCount = 0;
	for (var name in requiredTextures){
		var texInfo = requiredTextures[name];
		if (!texInfo.colorCode) continue;
		var commonAddress = "img/";
		var address = commonAddress + id + "/";
		texInfo.texture = PIXI.Texture.fromImage(address+name);
		if (texInfo.texture == null){
			deferredCount ++;
			gm(commonAddress+name).flip().write(address+name, function(err) {
				if(err) console.log(err);
				else texInfo.texture = PIXI.Texture.fromImage(address+name);
				if (--deferredCount <= 0) func();
			});
		}
	}
	if (deferredCount <= 0) func();
}

Graphics.update = function(){
	Graphics.renderer.render(Graphics.stage);
}

global.Graphics = Graphics;