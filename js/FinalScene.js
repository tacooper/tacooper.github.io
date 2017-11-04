// constructor inheriting Scene class
var FinalScene = function(canvas, collector) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.gameTime = 0; //msec elapsed
    this.collector = collector;
}
FinalScene.prototype = Object.create(Scene.prototype);
FinalScene.prototype.constructor = FinalScene;

// sprite update rates
const COLLECTOR_CENTER_RATE = 3; //pixels per frame
const BACKGROUND_COLOR = "#" +
    decToHex(FINAL_BACKGROUND_INDEX, 2) +
    decToHex(Math.round(0.75 * FINAL_BACKGROUND_INDEX), 2) +
    decToHex(Math.round(0.5 * FINAL_BACKGROUND_INDEX), 2); //yellow

// run loop every frame
FinalScene.prototype.loop = function() {
    // determine delta time and update previous frame time
    const currTime = Date.now();
    const deltaTime = currTime - this.frameTime;
    const skipFrame = (deltaTime <= MIN_FRAME ||
        deltaTime >= MAX_FRAME);
    this.frameTime = currTime;
    
    if (!skipFrame) {
        // update elapsed game time
        this.gameTime += deltaTime;
        
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // set static background color
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // migrate existing collector sprite to center of canvas
        const centerX = this.canvas.width / 2;
        var targetX = this.collector.x + (this.collector.img.width / 2);
        if (targetX < centerX) {
            targetX += COLLECTOR_CENTER_RATE;
            if (targetX > centerX) {
                targetX = centerX;
            }
        } else if (targetX > centerX) {
            targetX -= COLLECTOR_CENTER_RATE;
            if (targetX < centerX) {
                targetX = centerX;
            }
        }
        
        // update existing collector sprite
        this.collector.update(this.canvas, null, targetX);
        
        // draw existing collector sprite
        this.collector.draw(this.context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(this.loop.bind(this));
}
