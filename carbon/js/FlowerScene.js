// constructor inheriting Scene class
var FlowerScene = function(canvas, flowerpot, rainbow) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.flowerpot = flowerpot;
    this.rainbow = rainbow;
    this.stem = new Stem(canvas, this.flowerpot);
    this.bud = null;
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
        
        if (this.stem != null) {
            if (this.stem.createBud()) {
                // replace stem with bud sprite
                this.bud = new Bud(this.canvas, this.flowerpot);
                this.stem = null;
            } else {
                // update sprite in stem phase of flower
                this.stem.update(this.canvas);
                
                // draw sprite in stem phase of flower
                this.stem.draw(this.context);
            }
        }
        
        if (this.bud != null) {
            // update sprite in bud phase of flower
            this.bud.update(this.canvas);
            
            // draw sprite in bud phase of flower
            this.bud.draw(this.context);
        }
        
        // draw flowerpot and rainbow sprites (not updated)
        this.flowerpot.draw(this.context);
        this.rainbow.draw(this.context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(this.loop.bind(this));
}
