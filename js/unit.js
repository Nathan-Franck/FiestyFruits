function Unit (id, position, goal) {
    this.id = id;
    this.position = position;
    this.goal = goal;
    this.getInfo = function() {
        return id+" "+position +" "+goal;
    };
}
