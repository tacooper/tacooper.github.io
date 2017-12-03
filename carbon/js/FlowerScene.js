// constructor inheriting Scene class
var FlowerScene = function(canvas, flowerpot, rainbow) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.flowerpot = flowerpot;
    this.rainbow = rainbow;
}
FlowerScene.prototype = Object.create(Scene.prototype);
FlowerScene.prototype.constructor = FlowerScene;

// run loop every frame
FlowerScene.prototype.loop = function() {
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
        
        // draw existing flowerpot sprite
        this.flowerpot.draw(this.context);
        
        // draw existing rainbow sprite
        this.rainbow.draw(this.context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(this.loop.bind(this));
}
