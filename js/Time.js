function Time() {
	var data = new Date();
	this.startTime = date.getTime()/1000;
}
Time.startTime = 0;
Time.time = 0;
Time.deltaTime = 0;

Time.update = function() {
	var date = new Date();
	var nextTime = date.getTime()/1000-Time.startTime;
	Time.deltaTime = nextTime-Time.time;
	Time.time = nextTime;
}

global.Time = Time;