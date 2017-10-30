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
    const HALF_IMAGE_WIDTH = this.image.width / 2;
    const MIN_X = HALF_IMAGE_WIDTH;
    const MAX_X = canvas.width - HALF_IMAGE_WIDTH;
    
    // determine position based on bounded mouse/touch
    if (userPositionX) {
        var x = userPositionX - HALF_IMAGE_WIDTH;
        if (userPositionX < MIN_X) {
            x = 0;
        } else if (userPositionX > MAX_X) {
            x = canvas.width - this.image.width;
        }
        this.x = x;
    }
}
