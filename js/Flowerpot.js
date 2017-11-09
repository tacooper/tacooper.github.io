// constructor inheriting Sprite class
var Flowerpot = function(canvas, imgMap, collectorHeight, dirtPercent) {
    Sprite.call(this, imgMap["Flowerpot"]);
    
    // set initial state at bottom of canvas
    this.x = (canvas.width - this.img.width) / 2;
    this.y = canvas.height - collectorHeight;
    this.Y_RATE = -2; //pixels per frame
}
Flowerpot.prototype = Object.create(Sprite.prototype);
Flowerpot.prototype.constructor = Flowerpot;

// draw state every frame
Flowerpot.prototype.draw = function(context) {
    context.drawImage(this.img, this.x, this.y);
}

// update state every frame
Flowerpot.prototype.update = function(canvas) {
    if (this.y > (canvas.height - this.img.height)) {
        this.y += this.Y_RATE;
    }
}
