//initialize state
var Diamond = function(context, canvas, image) {
    this.context = context;
    this.image = image;
    
    this.x = (canvas.width / 2) - (this.image.width / 2);
    this.y = (-this.image.height);
}

//draw state every frame
Diamond.prototype.draw = function() {
    this.context.drawImage(this.image, this.x, this.y);
}

//update state every frame
Diamond.prototype.update = function() {
    this.y += 1;
}
