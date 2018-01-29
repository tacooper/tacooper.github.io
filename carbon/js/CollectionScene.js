// constructor inheriting Scene class
var CollectionScene = function(canvas) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.runTime = 0; //msec elapsed
    this.diamondTime = 500; //msec elapsed
    this.dirtTime = 0; //msec elapsed
    this.backgroundTime = 0; //msec elapsed
    this.backgroundIndex = 0;
    this.stopCreatingSprites = false;
    this.sprites = [];
    this.collector = null;
    this.rain = null;
}
CollectionScene.prototype = Object.create(Scene.prototype);
CollectionScene.prototype.constructor = CollectionScene;

// background and sprite update rates
const BACKGROUND_DELAY = 5000; //msec
const BACKGROUND_RATE = 100; //msec per change
const DIAMOND_RATE = 1000; //msec per create
const DIRT_RATE = 500; //msec per create
const FINAL_BACKGROUND_INDEX = 255; //color index

// run loop every frame
CollectionScene.prototype.loop = function() {
    // determine delta time and update previous frame time
    const currTime = Date.now();
    const deltaTime = currTime - this.frameTime;
    const skipFrame = (deltaTime <= MIN_FRAME ||
        deltaTime >= MAX_FRAME);
    this.frameTime = currTime;
    
    // waits until all images are loaded
    if (loadedAllImages &&
        !skipFrame) {
        // update elapsed game time
        this.runTime += deltaTime;
        
        // create collector sprite once
        if (!this.collector) {
            this.collector = new Collector(this.canvas);
        }
        
        // determine if time to change background color
        const deltaBackground = (this.runTime - this.backgroundTime);
        if (this.runTime >= BACKGROUND_DELAY &&
            deltaBackground >= BACKGROUND_RATE) {
            this.backgroundTime = this.runTime;
            
            // stop creating sprites when reaching final background color
            ++this.backgroundIndex;
            if (this.backgroundIndex > FINAL_BACKGROUND_INDEX) {
                this.backgroundIndex = FINAL_BACKGROUND_INDEX;
                this.stopCreatingSprites = true;
            }
        }
        
        // determine if time to create dirt
        const deltaDirt = (this.runTime - this.dirtTime);
        if (!this.stopCreatingSprites &&
            deltaDirt >= DIRT_RATE) {
            this.dirtTime = this.runTime;
            
            // create dirt sprite
            var dirt = new Dirt(this.canvas);
            this.sprites.push(dirt);
        }
        
        // determine if time to create diamond
        const deltaDiamond = (this.runTime - this.diamondTime);
        if (!this.stopCreatingSprites &&
            deltaDiamond >= DIAMOND_RATE) {
            this.diamondTime = this.runTime;
            
            // create diamond sprite
            var diamond = new Diamond(this.canvas, imgMap);
            this.sprites.push(diamond);
        }
        
        // create rain once when all sprites have been created
        if (this.stopCreatingSprites &&
            !this.rain) {
            this.rain = new Rain(this.canvas);
        }
        
        // clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // set dynamic background color (fade from black to yellow)
        const backgroundColor = "#" +
            decToHex(this.backgroundIndex, 2) +
            decToHex(Math.round(0.75 * this.backgroundIndex), 2) +
            decToHex(Math.round(0.5 * this.backgroundIndex), 2);
        this.context.fillStyle = backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // update all existing sprites
        if (this.sprites.length > 0) {
            this.sprites.forEach(function(sprite) {
                sprite.update(this.canvas, this.sprites);
            }, this);
        }
        
        // update existing collector sprite separately
        this.collector.update(this.canvas, this.sprites, userPositionX);
        
        // update existing rain at steadily increasing percentage
        if (this.rain) {
            this.rain.update(this.canvas, 1, true);
        }
        
        // draw all existing sprites
        if (this.sprites.length > 0) {
            this.sprites.forEach(function(sprite) {
                sprite.draw(this.context);
            }, this);
        }
        
        // draw existing collector sprite separately
        this.collector.draw(this.context);
        
        // draw existing rain
        if (this.rain) {
            this.rain.draw(this.context);
        }
    }
    
    if (this.runTime >= 1000 &&
        this.sprites.length == 0) {
        // enter next scene loop after all existing sprites are removed
        var scene = new RainbowScene(this.canvas, this.collector, this.rain);
        scene.loop();
    } else {
        // continue loop on next frame
        requestAnimationFrame(this.loop.bind(this));
    }
}
