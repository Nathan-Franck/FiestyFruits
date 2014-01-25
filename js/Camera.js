var Camera = {};

Camera.position = new Point();
Camera.height = 10;

Camera.zoom = function(zoom){
	Camera.height += zoom;
}

global.Camera = Camera;