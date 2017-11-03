// constructor inheriting Sprite class
var Dirt = function(canvas, imgMap) {
    Sprite.call(this, imgMap["Dirt"]);
    
    // randomize initial state at top of canvas
    this.x = Math.round(Math.random() * (canvas.width - this.img.width));
    this.y = -this.img.height;
    this.angle = Math.random() * (2 * Math.PI); //rad
    this.Y_RATE = 1;
    this.relation = Relation.ABOVE;
}
Dirt.prototype = Object.create(Sprite.prototype);
Dirt.prototype.constructor = Dirt;

// draw state every frame
Dirt.prototype.draw = function(context) {
    const halfImgWidth = this.img.width / 2;
    const halfImgHeight = this.img.height / 2;
    
    context.save();
    context.translate(this.x + halfImgWidth, this.y + halfImgHeight);
    context.rotate(this.angle);
    context.drawImage(this.img, -halfImgWidth, -halfImgHeight);
    context.translate(-halfImgWidth, -halfImgHeight);
    context.restore();
}

// update state every frame
Dirt.prototype.update = function(canvas, sprites) {
    this.y += this.Y_RATE;
    
    // remove this sprite if position passes bottom of canvas
    if (this.y > canvas.height) {
        const index = sprites.indexOf(this);
        sprites.splice(index, 1);
    }
}
