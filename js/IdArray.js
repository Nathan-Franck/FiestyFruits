function IdArray (idVar){
	this.idVar = idVar;
}

IdArray.prototype = new Array();

IdArray.prototype.add = function(o){ //create new o
	var i;
	//loop through existing list
	for (i = 0; i < this.length; i++){
		if (this[i] == null){
			this[i] = o;
			o[this.idVar] = i;
			return o;
		}
	}
	//or tack onto end of list
	o[this.idVar] = this.length;
	this.push(o);
	return o;
}

IdArray.prototype.enlist = function(o){
	if (o[this.idVar] == -1) return this.add(o); //if the id is -1 (unassigned), just add the object to a new space in the array
	while (this.length <= o[this.idVar]) {
		this.push(null);
	}
	this[o[this.idVar]] = o;
	return o;
}

global.IdArray = IdArray;