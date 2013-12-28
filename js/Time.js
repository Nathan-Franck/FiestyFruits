function Time() {
	this.startTime = Date.getTime()/1000;
}

Time.startTime = 0;
Time.time = 0;
Time.deltaTime = 0;

Time.update = function() {
	var nextTime = Date.getTime()/1000-startTime;
	Time.deltaTime = Time.nextTime-Time.time;
	Time.time = nextTime;
}
