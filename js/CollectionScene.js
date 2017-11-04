// constructor inheriting Scene class
var CollectionScene = function(canvas) {
    Scene.call(this, canvas);
    
    // set initial state
    this.frameTime = Date.now(); //msec
    this.gameTime = 0; //msec elapsed
    this.diamondTime = 500; //msec elapsed
    this.dirtTime = 0; //msec elapsed
    this.backgroundTime = 0; //msec elapsed
    this.backgroundIndex = 0;
    this.stopCreatingSprites = false;
    this.sprites = [];
    this.collector = null;
}
CollectionScene.prototype = Object.create(Scene.prototype);
CollectionScene.prototype.constructor = CollectionScene;

// background and sprite update rates
const BACKGROUND_DELAY = 10000; //msec
const BACKGROUND_RATE = 200; //msec per change
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
        this.gameTime += deltaTime;
        
        // create single collector
        if (!this.collector) {
            this.collector = new Collector(this.canvas, imgMap);
        }
        
        // determine if time to change background color
        const deltaBackground = (this.gameTime - this.backgroundTime);
        if (this.gameTime >= BACKGROUND_DELAY &&
            deltaBackground >= BACKGROUND_RATE) {
            this.backgroundTime = this.gameTime;
            
            // stop creating sprites when reaching final background color
            ++this.backgroundIndex;
            if (this.backgroundIndex > FINAL_BACKGROUND_INDEX) {
                this.backgroundIndex = FINAL_BACKGROUND_INDEX;
                this.stopCreatingSprites = true;
            }
        }
        
        // determine if time to create dirt
        const deltaDirt = (this.gameTime - this.dirtTime);
        if (!this.stopCreatingSprites &&
            deltaDirt >= DIRT_RATE) {
            this.dirtTime = this.gameTime;
            
            // create sprite from image map
            var dirt = new Dirt(this.canvas, imgMap);
            this.sprites.push(dirt);
        }
        
        // determine if time to create diamond
        const deltaDiamond = (this.gameTime - this.diamondTime);
        if (!this.stopCreatingSprites &&
            deltaDiamond >= DIAMOND_RATE) {
            this.diamondTime = this.gameTime;
            
            // create sprite from image map
            var diamond = new Diamond(this.canvas, imgMap);
            this.sprites.push(diamond);
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
        
        // draw all existing sprites
        if (this.sprites.length > 0) {
            this.sprites.forEach(function(sprite) {
                sprite.draw(this.context);
            }, this);
        }
        
        // draw existing collector sprite separately
        this.collector.draw(this.context);
    }
    
    if (this.gameTime >= 1000 &&
        this.sprites.length == 0) {
        // enter final scene loop after all existing sprites are removed
        var scene = new FinalScene(this.canvas, this.collector);
        scene.loop();
    } else {
        // continue loop on next frame
        requestAnimationFrame(this.loop.bind(this));
    }
}
