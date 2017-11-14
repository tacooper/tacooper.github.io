// constructor inheriting Sprite class
var Rainbow = function(canvas) {
    Sprite.call(this, imgMap["Rainbow"]);
    
    // set initial state at top of canvas
    this.x = 0;
    this.y = 0;
    this.width = canvas.width;
    this.opacity = 0; //percent (0-1)
    this.OPACITY_RATE = 0.001; //percent (0-1) per frame
}
Rainbow.prototype = Object.create(Sprite.prototype);
Rainbow.prototype.constructor = Rainbow;

// draw image every frame
Rainbow.prototype.draw = function(context) {
    context.save();
    context.globalAlpha = this.opacity;
    context.drawImage(this.img, this.x, this.y,
        this.width, this.img.height);
    context.restore();
}

// update state every frame
Rainbow.prototype.update = function(canvas) {
    // increase until reaching final opacity
    if (this.opacity < 0.25) {
        this.opacity += this.OPACITY_RATE;
    }
}
