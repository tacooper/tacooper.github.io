// constructor inheriting Sprite class
var Flower = function(canvas, flowerpot) {
    Sprite.call(this, imgMap["Flower"]);
    
    // set initial state at bottom of canvas
    this.enoughDirt = flowerpot.enoughDirt;
    this.flowerpotHeight = flowerpot.img.height;
    this.SUBIMAGE_WIDTH = 240;
    this.x = (canvas.width - this.SUBIMAGE_WIDTH) / 2;
    this.y = canvas.height - this.flowerpotHeight - (this.img.height / 2);
    this.Y_RATE = -1; //pixels per frame
    this.NUM_SUBIMAGES = 8;
    this.subimageIndex = 0;
    this.FRAMES_PER_SUBIMAGE = 10;
    this.frameCount = 0;
}
Flower.prototype = Object.create(Sprite.prototype);
Flower.prototype.constructor = Flower;

// draw image every frame
Flower.prototype.draw = function(context) {
    // only draw subimage at specified index
    const sourceX = (this.subimageIndex * this.SUBIMAGE_WIDTH);
    
    context.drawImage(this.img,
        sourceX, 0, this.SUBIMAGE_WIDTH, this.img.height,
        this.x, this.y, this.SUBIMAGE_WIDTH, this.img.height);
}

// update state every frame
Flower.prototype.update = function(canvas) {
    const finalY = (canvas.height - this.flowerpotHeight - this.img.height);
    
    // only translate until entire sprite is displayed on canvas
    if (this.y > finalY) {
        this.y += this.Y_RATE;
        
    // only animate subimages if flowerpot has enough dirt
    // (or just show first subimage of sprout)
    } else if (this.enoughDirt) {
        ++this.frameCount;
        
        // update index for subimage at partial frame rate
        if (this.subimageIndex < (this.NUM_SUBIMAGES - 1) &&
            this.frameCount >= this.FRAMES_PER_SUBIMAGE) {
            ++this.subimageIndex;
            this.frameCount = 0;
        }
    }
}
