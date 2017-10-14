//initialize state
var Diamond = function(context, canvas) {
    this.context = context;
    this.x = canvas.width / 2
    this.y = canvas.height / 2;
}

//draw state every frame
Diamond.prototype.draw = function() {
    this.context.beginPath();
    this.context.rect(this.x, this.y, 20, 20);
    this.context.fillStyle = "#0000FF";
    this.context.fill();
    this.context.closePath();
}

//update state every frame
Diamond.prototype.update = function() {
    this.x += 1;
    this.y += -1;
}