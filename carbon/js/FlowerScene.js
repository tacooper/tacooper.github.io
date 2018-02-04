// constructor inheriting Scene class
var FlowerScene = function(canvas, flowerpot, rainbow) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.flowerpot = flowerpot;
    this.rainbow = rainbow;
    this.stem = new Stem(canvas, this.flowerpot);
    this.bud = null;
    this.flower = null;
    this.retryButton = null;
    this.finishButton = null;
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
        
        // handle stem phase of flower
        if (this.stem != null) {
            if (this.stem.createBud()) {
                // replace stem with bud sprite
                this.bud = new Bud(this.canvas, this.flowerpot);
                this.stem = null;
            } else {
                // create retry button positioned above stem
                if (!this.retryButton &&
                    this.stem.createRetryButton()) {
                    this.retryButton = new RetryButton(this.stem.FINAL_Y);
                }
                
                // update sprite in stem phase
                this.stem.update(this.canvas);
                
                // draw sprite in stem phase
                this.stem.draw(this.context);
            }
        }
        
        // handle bud phase of flower
        if (this.bud != null) {
            if (this.bud.createFlower()) {
                // replace bud with flower sprite
                this.flower = new Flower(this.canvas, this.flowerpot);
                this.bud = null;
            } else {
                // update sprite in bud phase
                this.bud.update(this.canvas);
                
                // draw sprite in bud phase
                this.bud.draw(this.context);
            }
        }
        
        // handle flower phase of flower
        if (this.flower != null) {
            // create finish button positioned above flower
            if (!this.finishButton &&
                this.flower.createFinishButton()) {
                this.finishButton = new FinishButton(this.flower.y);
            } else {
                // update sprite in flower phase until button is created
                this.flower.update(this.canvas);
            }
            
            // draw sprite in flower phase
            this.flower.draw(this.context);
        }
        
        // draw flowerpot and rainbow sprites (not updated)
        this.flowerpot.draw(this.context);
        this.rainbow.draw(this.context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(this.loop.bind(this));
}
