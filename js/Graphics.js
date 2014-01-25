// object resposible for all visuals in game
var Graphics = {};

// initialize graphics for the game (server does not run this function)
Graphics.init = function (width, height){
	//get the list of images to be used in the game
	Graphics.compileRequiredTexturesList();
	// create an new instance of a pixi stage
	Graphics.stage = new PIXI.Stage(0x33FF55, true);
	// create a renderer instance
	Graphics.renderer = PIXI.autoDetectRenderer(width, height);
	Graphics.renderer.view.style.position = "absolute";
	Graphics.renderer.view.style.top = "0px";
	Graphics.renderer.view.style.left = "0px";
	// add the renderer view element to the DOM
	document.body.appendChild(Graphics.renderer.view);
	Graphics.isInitialized = true;

	$(window).resize(Graphics.resize);
	window.onorientationchange = Graphics.resize;
}

Graphics.resize = function(){
	Graphics.renderer.resize(window.innerWidth, window.innerHeight);
	World.resize();
}

// gather the list of textures required from all the game objects in the global space
Graphics.compileRequiredTexturesList = function(){
	Graphics.images = {};
	//go through all the global objects
	for (var key in global){
		//if there's no required textures, move on...
		if (!global[key].hasOwnProperty("requiredTextures")) continue;
		//get required textures and add to the main list
		var requiredTextures = global[key].requiredTextures;
		for (var texKey in requiredTextures){
			Graphics.images[texKey] = requiredTextures[texKey];
		}
	}

}

// render the colored textures for a given id, execute a function after rendering/loading is finished
Graphics.renderColoredTextures = function(id, func){
	var deferredCount = 0;
	// go through the required texture list
	for (var name in Graphics.images){
		// get info - address
		var img = Graphics.images[name];
		if (!img.colorCode) continue;
		//add id array to texture info
		if (img.textures == null) img.textures = new IdArray("colorID");
		// try to get texture from address
		var address = Graphics.coloredAddressFromName(name, id);
		var sharedAddress = Graphics.addressFromName(name);
		// if image isn't there yet, make the image
		var imageFunc = function() {
			fs.exists(address, function(exists) {
	  			if (!exists) {
					if (img.texture == null){
						deferredCount ++;
						//get color for id
						var color = Graphics.colorForID(id);
						//render the texture
						var mat = [[color.r, color.r, color.r], [color.g, color.g, color.g], [color.b, color.b, color.b]];
						gm(sharedAddress).recolor(mat).write(address, function(err) {
							if(err) console.log(err);
							//once no more deferred functions need to be executed, run the function
							if (--deferredCount <= 0) func();
						});
					}
				}
				if (deferredCount <= 0) func();
			});
		}
		//make directories to put rendered images into
		var folderFunc = function(){
			fs.exists(Graphics.commonAddress+"/rendered/"+id, function(exists){
				if (exists) imageFunc();
				else {
					console.log("Making new image directory "+id+"...");
					fs.mkdir(Graphics.commonAddress+"/rendered/"+id, imageFunc);
				}
			})
		};
		fs.exists(Graphics.commonAddress+"/rendered", function(exists){
			if (exists) folderFunc();
			else {
				console.log("Making rendered directory...");
				fs.mkdir(Graphics.commonAddress+"/rendered", folderFunc);
			}
		})
	}
}

Graphics.addressFromName = function(name){
	return Graphics.commonAddress+"/"+name;
}

Graphics.coloredAddressFromName = function(name, id){
	return Graphics.commonAddress+"/rendered/"+id+"/"+name;
}

Graphics.retrieveTexture = function(name){
	var img = Graphics.images[name];
	if (img == null) return null;
	if (img.texture == null){
		img.texture = PIXI.Texture.fromImage(Graphics.addressFromName(name));
	}
	return img.texture;
}

Graphics.retrieveColoredTexture = function(name, id){
	var img = Graphics.images[name];
	if (img == null) return null;
	if (img.textures == null) img.textures = new IdArray("texID");
	if (img.textures.length <= id || img.textures[id] == null){
		var tex = PIXI.Texture.fromImage(Graphics.coloredAddressFromName(name, id));
		tex.texID = id;
		img.textures.enlist(tex);
	}

	return img.textures[id];
}

Graphics.colorForID = function(id){
	var color = Graphics.hslToRgb(id*120312.234353, .9, .4);
	return color;
}

//convert hsl to rgb format, used for generating player colors
Graphics.hslToRgb = function(h, s, l){
	var col = {};
    if(s == 0){
        col.r = col.g = col.b = l; // achromatic
    }else{
        function hue2rgb(p, q, t){
        	t -= Math.floor(t);
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        col.r = hue2rgb(p, q, h + 1/3);
        col.g = hue2rgb(p, q, h);
        col.b = hue2rgb(p, q, h - 1/3);
    }
    return col;
}

// redraw the game scene
Graphics.update = function(){
	Graphics.renderer.render(Graphics.stage);
}

Graphics.commonAddress = "img";

global.Graphics = Graphics;