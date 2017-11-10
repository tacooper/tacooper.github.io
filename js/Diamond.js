// constructor inheriting Sprite class
var Diamond = function(canvas) {
    Sprite.call(this, imgMap["Diamond"]);
    
    // randomize initial state at top of canvas
    this.x = Math.round(Math.random() * (canvas.width - this.img.width));
    this.y = -this.img.height;
    this.angle = Math.random() * (2 * Math.PI); //rad
    this.ROTATION_RATE = (2 * Math.round(Math.random()) - 1) *
        (0.05 * Math.random() + 0.03); //rad per frame
    this.Y_RATE = 1; //pixels per frame
    this.relation = Relation.ABOVE;
}
Diamond.prototype = Object.create(Sprite.prototype);
Diamond.prototype.constructor = Diamond;

// draw state every frame
Diamond.prototype.draw = function(context) {
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
Diamond.prototype.update = function(canvas, sprites) {
    this.y += this.Y_RATE;
    this.angle += this.ROTATION_RATE;
    
    // remove this sprite if position passes bottom of canvas
    if (this.y > canvas.height) {
        const index = sprites.indexOf(this);
        sprites.splice(index, 1);
    }
}
