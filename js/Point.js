function Point (x, y){
	this.x = x || 0;
	this.y = y || 0;

	this.init = function(point){
		this.x = point.x;
		this.y = point.y;
		return this;
	}

	this.add = function(point){
		this.x += point.x;
		this.y += point.y;
		return this;
	}

	this.sub = function(point){
		this.x -= point.x;
		this.y -= point.y;
		return this;
	}

	this.normalize = function(){
		var length = this.magnitude();
		if (length > 0){
			this.x /= length;
			this.y /= length;
		}
		return this;
	}

	this.magnitude = function(){
		return Math.sqrt(this.x*this.x+this.y*this.y);
	}

	this.getInfo = function(){
		return "Point: {"+this.x +", "+ this.y+"}";
	}
}

global.Point = Point;
