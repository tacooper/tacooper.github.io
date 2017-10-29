// constructor inheriting Sprite class
var Diamond = function(context, canvas, imageMap) {
    Sprite.call(this, context, imageMap["Diamond"]);
    
    // randomize start position on top of canvas
    this.x = Math.round(Math.random() * (canvas.width - this.image.width));
    this.y = -this.image.height;
}
Diamond.prototype = Object.create(Sprite.prototype);
Diamond.prototype.constructor = Diamond;

// draw state every frame
Diamond.prototype.draw = function() {
    this.context.drawImage(this.image, this.x, this.y);
}

// update state every frame
Diamond.prototype.update = function(canvas, sprites) {
    this.y += 1;
    
    // remove this sprite if position passes bottom of canvas
    if (this.y > canvas.height) {
        var index = sprites.indexOf(this);
        sprites.splice(index, 1);
    }
}
