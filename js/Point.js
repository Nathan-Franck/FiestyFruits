function Point (x, y){
	this.x = x || 0;
	this.y = y || 0;
}

Point.add = function(point){
	this.x += point.x;
	this.y += point.y;
}

Point.sub = function(point){
	this.x -= point.x;
	this.y -= point.y;
}

Point.normalize = function(){
	var length = this.magnitude;
	if (length > 0){
		this.x /= length;
		this.y /= length;
	}
}

Point.magnitude = function(){
	return Math.sqrt(x*x+y*y);
}
