// constructor for class
var Rain = function(canvas) {
    // set initial state
    this.raindrops = [];
    this.NUM_FULL_RAINDROPS = 1000;
}

// draw lines every frame
Rain.prototype.draw = function(context) {
    // configure lines
    context.strokeStyle = 'rgb(79, 146, 255)';
    context.lineCap = 'round';
    context.lineWidth = 2;
    
    // draw line for each raindrop
    this.raindrops.forEach(function(raindrop) {
        context.beginPath();
        context.moveTo(raindrop.x, raindrop.y);
        context.lineTo(raindrop.x + raindrop.xOffset,
            raindrop.y + raindrop.yOffset);
        context.stroke();
    });
}

// update state every frame
Rain.prototype.update = function(canvas, percentRaindrops, increasing) {
    const NUM_TARGET_RAINDROPS = this.NUM_FULL_RAINDROPS * percentRaindrops;
    
    // add new raindrop twice per frame until reaching full group
    if (increasing &&
        this.raindrops.length < NUM_TARGET_RAINDROPS) {
        var raindrop1 = this.initRaindrop(canvas);
        var raindrop2 = this.initRaindrop(canvas);
        
        this.raindrops.push(raindrop1);
        this.raindrops.push(raindrop2);
    }
    
    // update state for each raindrop in group
    this.raindrops.forEach(function(raindrop) {
        raindrop.x += raindrop.xOffset;
        raindrop.y += raindrop.yOffset;
        
        // handle raindrop after leaving canvas
        if (raindrop.x > canvas.width ||
            raindrop.y > canvas.height) {
            // recycle into new raindrop at top of canvas
            var newRaindrop = this.initRaindrop(canvas);
            raindrop.x = newRaindrop.x;
            raindrop.y = newRaindrop.y;
            raindrop.xOffset = newRaindrop.xOffset;
            raindrop.yOffset = newRaindrop.yOffset;
            
            // randomly remove raindrop until reaching decreased group
            if (!increasing &&
                this.raindrops.length > NUM_TARGET_RAINDROPS &&
                (this.raindrops.length < 100 ||
                Math.random() < 0.6)) {
                const index = this.raindrops.indexOf(raindrop);
                this.raindrops.splice(index, 1);
            }
        }
    }, this);
}

// initialize single raindrop at random position above top of canvas
Rain.prototype.initRaindrop = function(canvas) {
    return {
        x: (Math.random() * (canvas.width + 200)) - 200,
        y: Math.random() * -canvas.height,
        xOffset: 2,
        yOffset: 10 + (10 * Math.random())
    };
}
