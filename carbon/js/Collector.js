// enum for relation of sprite to collector
const Relation = {
    ABOVE: "above",
    INSIDE: "inside",
    OUTSIDE_LEFT: "outside left",
    OUTSIDE_RIGHT: "outside right"
}

// constructor inheriting Sprite class
var Collector = function(canvas) {
    Sprite.call(this, imgMap["Collector"]);
    
    // set initial state at bottom of canvas
    this.x = (canvas.width - this.img.width) / 2;
    this.y = canvas.height - this.img.height;
    this.prevX = this.x;
    this.numCollectedDiamonds = 0;
    this.numCollectedDirts = 0;
}
Collector.prototype = Object.create(Sprite.prototype);
Collector.prototype.constructor = Collector;

// draw image every frame
Collector.prototype.draw = function(context) {
    context.drawImage(this.img, this.x, this.y);
}

// update state every frame
Collector.prototype.update = function(canvas, sprites, inputX) {
    const halfImgWidth = this.img.width / 2;
    const minX = halfImgWidth;
    const maxX = canvas.width - halfImgWidth;
    
    // determine position based on input
    if (inputX) {
        var x = inputX - halfImgWidth;
        if (inputX < minX) {
            x = 0;
        } else if (inputX > maxX) {
            x = canvas.width - this.img.width;
        }
        this.prevX = this.x;
        this.x = x;
    }
    
    // handle any collisions with other sprites
    if (sprites) {
        this.handleCollisions(sprites);
    }
}

// update state every frame, moving to center of canvas
Collector.prototype.updateToCenter = function(canvas) {
    const centerCanvas = canvas.width / 2;
    const halfImgWidth = this.img.width / 2;
    var centerX = this.x + halfImgWidth;
    
    // migrate sprite to center of canvas
    if (centerX < centerCanvas) {
        centerX += COLLECTOR_CENTER_RATE;
        if (centerX > centerCanvas) {
            centerX = centerCanvas;
        }
    } else if (centerX > centerCanvas) {
        centerX -= COLLECTOR_CENTER_RATE;
        if (centerX < centerCanvas) {
            centerX = centerCanvas;
        }
    }
    
    // update sprite position
    this.update(canvas, null, centerX);
    
    return (centerX == centerCanvas);
}

// handle relation to collector, collecting, and collisions for all sprites
Collector.prototype.handleCollisions = function(sprites) {
    const thisLeftEdge = this.x;
    const thisRightEdge = this.x + this.img.width;
    const thisTopEdge = this.y;
    const thisPrevLeftEdge = this.prevX;
    const thisPrevRightEdge = this.prevX + this.img.width;
    
    sprites.forEach(function(sprite) {
        const spriteLeftEdge = sprite.x;
        const spriteRightEdge = sprite.x + sprite.img.width;
        const spriteTopEdge = sprite.y;
        const spriteBottomEdge = sprite.y + sprite.img.height;
        
        // determine permanent relation of sprite to collector
        if (sprite.relation == Relation.ABOVE &&
            spriteBottomEdge > (thisTopEdge + 1)) {
            if (spriteRightEdge < thisLeftEdge) {
                sprite.relation = Relation.OUTSIDE_LEFT;
            } else if (spriteLeftEdge > thisRightEdge) {
                sprite.relation = Relation.OUTSIDE_RIGHT;
            } else {
                sprite.relation = Relation.INSIDE;
            }
        }
        
        // collect any sprite that is completely inside
        if (sprite.relation == Relation.INSIDE &&
            spriteTopEdge > thisTopEdge) {
            // update counters for collected sprites
            if (sprite instanceof Diamond) {
                ++this.numCollectedDiamonds;
            } else if (sprite instanceof Dirt) {
                ++this.numCollectedDirts;
            }
            
            // remove this sprite if position passes top of collector
            // (instead of bottom of canvas)
            const index = sprites.indexOf(sprite);
            sprites.splice(index, 1);
            
        // float any sprite that collides on top of either edge of collector
        } else if (sprite.relation == Relation.ABOVE &&
                   spriteBottomEdge > thisTopEdge) { //top edge
            if ((thisLeftEdge > spriteLeftEdge &&
                thisLeftEdge < spriteRightEdge) || //left edge
                (thisRightEdge > spriteLeftEdge &&
                thisRightEdge < spriteRightEdge)) { //right edge
                sprite.y -= sprite.Y_RATE;
            }
            
        // push any sprite that collides into left edge of collector moving left
        } else if (sprite.relation == Relation.OUTSIDE_LEFT &&
                   thisLeftEdge < spriteRightEdge && //overlap
                   thisLeftEdge < thisPrevLeftEdge) { //moving left
            sprite.x = thisLeftEdge - sprite.img.width;
            
        // push any sprite that collides into left edge of collector moving right
        } else if (sprite.relation == Relation.INSIDE &&
                   thisLeftEdge > spriteLeftEdge && //overlap
                   thisLeftEdge > thisPrevLeftEdge) { //moving right
            sprite.x = thisLeftEdge;
            
        // push any sprite that collides into right edge of collector moving right
        } else if (sprite.relation == Relation.OUTSIDE_RIGHT &&
                   thisRightEdge > spriteLeftEdge && //overlap
                   thisRightEdge > thisPrevRightEdge) { //moving right
            sprite.x = thisRightEdge;
            
        // push any sprite that collides into right edge of collector moving left
        } else if (sprite.relation == Relation.INSIDE &&
                   thisRightEdge < spriteRightEdge && //overlap
                   thisRightEdge < thisPrevRightEdge) { //moving right
            sprite.x = thisRightEdge - sprite.img.width;
        }
    }, this);
}
