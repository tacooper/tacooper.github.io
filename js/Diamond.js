// constructor inheriting Sprite class
var Diamond = function(canvas, imageMap) {
    Sprite.call(this, imageMap["Diamond"]);
    
    // randomize initial state at top of canvas
    this.x = Math.round(Math.random() * (canvas.width - this.image.width));
    this.y = -this.image.height;
    this.angle = Math.random() * (2 * Math.PI); //rad
    this.ROTATION_RATE = (2 * Math.round(Math.random()) - 1) *
        (0.05 * Math.random() + 0.03); //rad per frame
}
Diamond.prototype = Object.create(Sprite.prototype);
Diamond.prototype.constructor = Diamond;

// draw state every frame
Diamond.prototype.draw = function(context) {
    const HALF_IMAGE_WIDTH = this.image.width / 2;
    const HALF_IMAGE_HEIGHT = this.image.height / 2;
    
    context.save();
    context.translate(this.x + HALF_IMAGE_WIDTH, this.y + HALF_IMAGE_HEIGHT);
    context.rotate(this.angle);
    context.drawImage(this.image, -HALF_IMAGE_WIDTH, -HALF_IMAGE_HEIGHT);
    context.translate(-HALF_IMAGE_WIDTH, -HALF_IMAGE_HEIGHT);
    context.restore();
}

// update state every frame
Diamond.prototype.update = function(canvas, sprites) {
    this.y += 1;
    this.angle += this.ROTATION_RATE;
    
    // remove this sprite if position passes bottom of canvas
    if (this.y > canvas.height) {
        const index = sprites.indexOf(this);
        sprites.splice(index, 1);
    }
}
