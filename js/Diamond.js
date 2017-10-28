//constructor inheriting Sprite
var Diamond = function(context, canvas, image) {
    Sprite.call(this, context, image);
    
    this.x = (canvas.width / 2) - (this.image.width / 2);
    this.y = (-this.image.height);
}
Diamond.prototype = Object.create(Sprite.prototype);
Diamond.prototype.constructor = Diamond;

//draw state every frame
Diamond.prototype.draw = function() {
    this.context.drawImage(this.image, this.x, this.y);
}

//update state every frame
Diamond.prototype.update = function() {
    this.y += 1;
}
