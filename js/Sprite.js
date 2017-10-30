// constructor for abstract class
var Sprite = function(image) {
    this.image = image;
    if (this.constructor === Sprite) {
        console.error("Sprite is instantiated as abstract class");
    }
}

// draw state every frame
Sprite.prototype.draw = function(context) {
    console.error("Sprite.draw is unimplemented abstract method");
}

// update state every frame
Sprite.prototype.update = function(canvas, sprites) {
    console.error("Sprite.update is unimplemented abstract method");
}
