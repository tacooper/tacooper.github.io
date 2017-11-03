// constructor inheriting Sprite class
var Collector = function(canvas, imageMap) {
    Sprite.call(this, imageMap["Collector"]);
    
    // set initial state at bottom of canvas
    this.x = (canvas.width - this.image.width) / 2;
    this.y = canvas.height - this.image.height;
}
Collector.prototype = Object.create(Sprite.prototype);
Collector.prototype.constructor = Collector;

// draw state every frame
Collector.prototype.draw = function(context) {
    context.drawImage(this.image, this.x, this.y);
}

// update state every frame
Collector.prototype.update = function(canvas, userPositionX) {
    const halfImageWidth = this.image.width / 2;
    const minX = halfImageWidth;
    const maxX = canvas.width - halfImageWidth;
    
    // determine position based on bounded mouse/touch
    if (userPositionX) {
        var x = userPositionX - halfImageWidth;
        if (userPositionX < minX) {
            x = 0;
        } else if (userPositionX > maxX) {
            x = canvas.width - this.image.width;
        }
        this.x = x;
    }
}
