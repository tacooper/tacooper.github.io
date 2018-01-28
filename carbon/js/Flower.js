// constructor inheriting Sprite class
var Flower = function(canvas, flowerpot) {
    Sprite.call(this, imgMap["FlowerSheet"]);
    
    // set initial state at bottom of canvas
    this.flowerpotHeight = flowerpot.img.height;
    this.SUBIMAGE_WIDTH = 100;
    this.x = (canvas.width - this.SUBIMAGE_WIDTH) / 2;
    this.y = canvas.height - this.flowerpotHeight - this.img.height;
    this.NUM_SUBIMAGES = 12;
    this.subimageIndex = 0;
    this.FRAMES_PER_SUBIMAGE = 10;
    this.frameCount = 0;
    
    // stem is offset compared to previous sheets
    this.X_OFFSET = -2;
}
Flower.prototype = Object.create(Sprite.prototype);
Flower.prototype.constructor = Flower;

// draw image every frame
Flower.prototype.draw = function(context) {
    // only draw subimage at specified index
    const sourceX = (this.subimageIndex * this.SUBIMAGE_WIDTH);
    const destX = (this.x + this.X_OFFSET);
    
    context.drawImage(this.img,
        sourceX, 0, this.SUBIMAGE_WIDTH, this.img.height,
        destX, this.y, this.SUBIMAGE_WIDTH, this.img.height);
}

// update state every frame
Flower.prototype.update = function(canvas) {
    // animate subimages
    ++this.frameCount;
    
    // update index for subimage at partial frame rate
    if (this.subimageIndex < (this.NUM_SUBIMAGES - 1) &&
        this.frameCount >= this.FRAMES_PER_SUBIMAGE) {
        ++this.subimageIndex;
        this.frameCount = 0;
    }
}
