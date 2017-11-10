// constructor inheriting Sprite class
var Filling = function(canvas, imgType, flowerpot) {
    Sprite.call(this, imgMap[imgType]);
    
    // randomize initial state inside flowerpot at bottom of canvas
    const halfImgWidth = this.img.width / 2;
    const halfImgHeight = this.img.height / 2;
    this.x = flowerpot.x + halfImgWidth + Math.round(Math.random() * 
        (flowerpot.img.width - (2 * this.img.width)));
    this.y = canvas.height - halfImgHeight + Math.round(Math.random() *
        (flowerpot.fillingHeight - this.img.height));
    this.angle = Math.random() * (2 * Math.PI); //rad
    this.Y_RATE = -2; //pixels per frame
}
Filling.prototype = Object.create(Sprite.prototype);
Filling.prototype.constructor = Filling;

// draw image every frame
Filling.prototype.draw = function(context) {
    const halfImgWidth = this.img.width / 2;
    const halfImgHeight = this.img.height / 2;
    
    context.save();
    context.translate(this.x + halfImgWidth, this.y + halfImgHeight);
    context.rotate(this.angle);
    context.drawImage(this.img, -halfImgWidth, -halfImgHeight);
    context.translate(-halfImgWidth, -halfImgHeight);
    context.restore();
}

// update state every frame
Filling.prototype.update = function() {
    this.y += this.Y_RATE;
}
