// constructor for abstract class
var Sprite = function(img) {
    this.img = img;
    if (this.constructor === Sprite) {
        console.error("Sprite is instantiated as abstract class");
    }
}

// draw state every frame
Sprite.prototype.draw = function() {
    console.error("Sprite.draw is unimplemented abstract method");
}

// update state every frame
Sprite.prototype.update = function() {
    console.error("Sprite.update is unimplemented abstract method");
}
