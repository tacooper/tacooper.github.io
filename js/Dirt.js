// constructor inheriting Sprite class
var Dirt = function(canvas, imageMap) {
    Sprite.call(this, imageMap["Dirt"]);
    
    // randomize initial state at top of canvas
    this.x = Math.round(Math.random() * (canvas.width - this.image.width));
    this.y = -this.image.height;
    this.angle = Math.random() * (2 * Math.PI); //rad
}
Dirt.prototype = Object.create(Sprite.prototype);
Dirt.prototype.constructor = Dirt;

// draw state every frame
Dirt.prototype.draw = function(context) {
    const halfImageWidth = this.image.width / 2;
    const halfImageHeight = this.image.height / 2;
    
    context.save();
    context.translate(this.x + halfImageWidth, this.y + halfImageHeight);
    context.rotate(this.angle);
    context.drawImage(this.image, -halfImageWidth, -halfImageHeight);
    context.translate(-halfImageWidth, -halfImageHeight);
    context.restore();
}

// update state every frame
Dirt.prototype.update = function(canvas, sprites) {
    ++this.y;
    
    // remove this sprite if position passes bottom of canvas
    if (this.y > canvas.height) {
        const index = sprites.indexOf(this);
        sprites.splice(index, 1);
    }
}
