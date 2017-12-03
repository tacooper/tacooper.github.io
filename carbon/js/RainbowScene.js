// constructor inheriting Scene class
var RainbowScene = function(canvas, collector, rain) {
    Scene.call(this, canvas);
    
    // stop tracking mouse/touch position for moving collector
    canvas.removeEventListener("mousemove", handleMouseMove, false);
    canvas.removeEventListener("touchmove", handleTouchMove, false);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.collector = collector;
    this.rain = rain;
    this.flowerpot = null;
    this.rainbow = null;
}
RainbowScene.prototype = Object.create(Scene.prototype);
RainbowScene.prototype.constructor = RainbowScene;

// update rate and color
const COLLECTOR_CENTER_RATE = 2; //pixels per frame
const BACKGROUND_COLOR = "#" +
    decToHex(FINAL_BACKGROUND_INDEX, 2) +
    decToHex(Math.round(0.75 * FINAL_BACKGROUND_INDEX), 2) +
    decToHex(Math.round(0.5 * FINAL_BACKGROUND_INDEX), 2); //yellow

// run loop every frame
RainbowScene.prototype.loop = function() {
    // determine delta time and update previous frame time
    const currTime = Date.now();
    const deltaTime = currTime - this.frameTime;
    const skipFrame = (deltaTime <= MIN_FRAME ||
        deltaTime >= MAX_FRAME);
    this.frameTime = currTime;
    
    var readyForNextScene = false;
    if (!skipFrame) {
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // set static background color
        this.context.fillStyle = BACKGROUND_COLOR;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // handle existing collector or flowerpot sprite
        if (this.collector) {
            // update existing collector sprite
            const collectorCentered =
                this.collector.updateToCenter(this.canvas);
            
            // draw existing collector sprite
            this.collector.draw(this.context);
            
            // replace collector with flowerpot when reaching center of canvas
            if (collectorCentered) {
                // determine percentage of dirt in total collected
                // (null if nothing is collected)
                const totalCollected = this.collector.numCollectedDirts +
                    this.collector.numCollectedDiamonds;
                var dirtPercent = null;
                if (totalCollected > 0) {
                    dirtPercent = (this.collector.numCollectedDirts / totalCollected);
                }
                
                // replace sprite unless nothing is collected
                if (dirtPercent != null) {
                    // remove collector sprite
                    const collectorHeight = this.collector.img.height;
                    this.collector = null;
                    
                    // create flowerpot sprite
                    this.flowerpot = new Flowerpot(this.canvas,
                        collectorHeight, dirtPercent);
                }
            }
        } else if (this.flowerpot) {
            // update existing flowerpot sprite
            const fullyDisplayed = this.flowerpot.update(this.canvas);
            
            // draw existing flowerpot sprite
            this.flowerpot.draw(this.context);
            
            // create rainbow sprite when flowerpot is fully on canvas
            if (fullyDisplayed &&
                !this.rainbow) {
                this.rainbow = new Rainbow(this.canvas);
            }
        }
        
        var rainbowFinal = false;
        if (this.rainbow) {
            // update existing rainbow sprite
            rainbowFinal = this.rainbow.update(this.canvas);
            
            // draw existing rainbow sprite
            this.rainbow.draw(this.context);
        }
        
        // update rain at full or steadily decreasing percentage
        const percentRaindrops = (this.flowerpot == null) ? 1 : 0;
        const rainEnded = this.rain.update(this.canvas, percentRaindrops, false);
        
        // draw rain
        this.rain.draw(this.context);
        
        // check if rainbow and rain have finished updating
        if (rainbowFinal &&
            rainEnded) {
            readyForNextScene = true;
        }
    }
    
    if (readyForNextScene) {
        // enter next scene loop when ready
        var scene = new FlowerScene(this.canvas, this.flowerpot, this.rainbow);
        scene.loop();
    } else {
        // continue loop on next frame
        requestAnimationFrame(this.loop.bind(this));
    }
}
