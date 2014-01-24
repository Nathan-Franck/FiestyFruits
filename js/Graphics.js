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
	Game.images = {};
	//go through all the global objects
	for (var key in global){
		//if there's no required textures, move on...
		if (!global[key].hasOwnProperty("requiredTextures")) continue;
		//get required textures and add to the main list
		var requiredTextures = global[key].requiredTextures;
		for (var j = 0; j < requiredTextures.length; j ++){
			Game.images[key] = requiredTextures(requiredTextures[j]);
		}
	}
}

// render the colored textures for a given id, execute a function after rendering/loading is finished
Graphics.renderColoredTextures = function(id, func){
	var deferredCount = 0;
	// go through the required texture list
	for (var name in images){
		// get info - address
		var img = images[name];
		if (!img.colorCode) continue;
		//add id array to texture info
		if (img.textures == null) img.textures = new IdArray("colorID");
		// try to get texture from address
		var address = commonAddress + id + "/";
		var tex = PIXI.Texture.fromImage(address+name);
		// if texture isn't there yet, make the file
		if (img.texture == null){
			deferredCount ++;
			//render the texture
			gm(Graphics.commonAddress+name).flip().write(address+name, function(err) {
				if(err) console.log(err);
				else {
					tex = PIXI.Texture.fromImage(address+name);
					tex.colorID = id;
					img.textures.enlist(tex);
				}
				//once no more deferred functions need to be executed, run the function
				if (--deferredCount <= 0) func();
			});
		}
		else {
			tex.colorID = id;
			img.textures.enlist(tex);
		}
	}
	if (deferredCount <= 0) func();
}

Graphics.addressFromName = function(name, id){
	return Graphics.commonAddress+"/"+name;
}

Graphics.coloredAddressFromName = function(name, id){
	return Graphics.commonAddress+"/"+id+"/"+name;
}

Graphics.retrieveTexture = function(name){
	var img = images[addr];
	if (img == null) return null;
	if (img.texture == null){
		img.texture = PIXI.Texture.fromImage(Graphics.addressFromName(name));
	}
	return img.texture;
}

Graphics.retrieveColoredTexture = function(name, id){
	var img = images[addr];
	if (img == null) return null;
	if (img.textures.length <= id || img.textures[id] == null){
		img.textures.enlist(PIXI.Texture.fromImage(Graphics.coloredAddressFromName(name, id)));
	}
	return img.textures[id];
}

// redraw the game scene
Graphics.update = function(){
	Graphics.renderer.render(Graphics.stage);
}

Graphics.commonAddress = "img/";

global.Graphics = Graphics;