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
    // only update until entire sprite is displayed on canvas
    if (this.y > (canvas.height - this.img.height)) {
        // update state for each filling sprite
        this.sprites.forEach(function(sprite) {
            sprite.update();
        });
        
        this.y += this.Y_RATE;
    }
}

// create group of sprites for filling flowerpot
Flowerpot.prototype.createFillingSprites = function(canvas, dirtPercent) {
    const NUM_TOTAL = 1000;
    const NUM_DIRTS = Math.round(NUM_TOTAL * dirtPercent);
    
    for (var i = 0; i < NUM_DIRTS; ++i) {
        // create filling sprite with dirt image
        var dirt = new Filling(canvas, "Dirt", this);
        this.sprites.push(dirt);
    }
    
    for (var i = NUM_DIRTS; i < NUM_TOTAL; ++i) {
        // create filling sprite with diamond image
        var diamond = new Filling(canvas, "Diamond", this);
        this.sprites.push(diamond);
    }
}
