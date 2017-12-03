// constructor inheriting Sprite class
var Flower = function(canvas, flowerpot) {
    Sprite.call(this, imgMap["Flower"]);
    
    // set initial state at bottom of canvas
    this.flowerpotHeight = flowerpot.img.height;
    this.x = (canvas.width - this.img.width) / 2;
    this.y = canvas.height - this.flowerpotHeight - (this.img.height / 2);
    this.Y_RATE = -1; //pixels per frame
}
Flower.prototype = Object.create(Sprite.prototype);
Flower.prototype.constructor = Flower;

// draw image every frame
Flower.prototype.draw = function(context) {
    context.save();
    context.drawImage(this.img, this.x, this.y);
    context.restore();
}

// update state every frame
Flower.prototype.update = function(canvas) {
    const finalY = (canvas.height - this.flowerpotHeight - this.img.height);
    
    // only translate until entire sprite is displayed on canvas
    if (this.y > finalY) {
        this.y += this.Y_RATE;
    }
}
