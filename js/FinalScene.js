// constructor inheriting Scene class
var FinalScene = function(canvas) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.gameTime = 0; //msec elapsed
}
FinalScene.prototype = Object.create(Scene.prototype);
FinalScene.prototype.constructor = FinalScene;

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
        
        // set background color (yellow)
        const backgroundColorIndex = 255;
        const backgroundColor = "#" +
            decToHex(backgroundColorIndex, 2) +
            decToHex(Math.round(0.75 * backgroundColorIndex), 2) +
            decToHex(Math.round(0.5 * backgroundColorIndex), 2);
        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // continue loop on next frame
    requestAnimationFrame(this.loop.bind(this));
}
