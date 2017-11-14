// constructor inheriting Sprite class
var Flowerpot = function(canvas, collectorHeight, dirtPercent) {
    Sprite.call(this, imgMap["Flowerpot"]);
    
    // set initial state at bottom of canvas
    this.x = (canvas.width - this.img.width) / 2;
    this.y = canvas.height - collectorHeight;
    this.Y_RATE = -2; //pixels per frame
    this.fillingHeight = this.img.height - (collectorHeight / 2);
    this.sprites = [];
    
    this.createFillingSprites(canvas, dirtPercent);
}
Flowerpot.prototype = Object.create(Sprite.prototype);
Flowerpot.prototype.constructor = Flowerpot;

// draw image every frame
Flowerpot.prototype.draw = function(context) {
    // draw image for each filling sprite
    this.sprites.forEach(function(sprite) {
        sprite.draw(context);
    });
    
    context.drawImage(this.img, this.x, this.y);
}

// update state every frame
Flowerpot.prototype.update = function(canvas) {
    const fullyDisplayed = (this.y <= (canvas.height - this.img.height));
    
    // only update until entire sprite is displayed on canvas
    if (!fullyDisplayed) {
        // update state for each filling sprite
        this.sprites.forEach(function(sprite) {
            sprite.update();
        });
        
        this.y += this.Y_RATE;
    }
    
    return fullyDisplayed;
}

// create group of sprites for filling flowerpot
Flowerpot.prototype.createFillingSprites = function(canvas, dirtPercent) {
    for (var i = 0; i < 1000; ++i) {
        // determine image based on collected percentage
        const imgType = (Math.random() < dirtPercent) ?
            "Dirt" : "Diamond";
        
        // create filling sprite with either image
        var filling = new Filling(canvas, imgType, this);
        this.sprites.push(filling);
    }
}
