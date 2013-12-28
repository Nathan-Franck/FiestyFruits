function Unit (id, position, goal) {
	this.id = id;
	this.position = position;
	this.goal = goal;
}

Unit.getInfo = function() {
	return id+" "+position +" "+goal;
};

Unit.update = function() {
	pos += (goal.sub(pos)).normalize()*Time.deltaTime;
}
