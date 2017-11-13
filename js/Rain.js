// constructor for class
var Rain = function(canvas) {
    // set initial state
    this.raindrops = [];
    
    // create group of raindrops
    for (var i = 0; i < 1000; ++i) {
        var raindrop = this.initRaindrop(canvas);
        this.raindrops.push(raindrop);
    }
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
Rain.prototype.update = function(canvas) {
    // update state for each raindrop
    this.raindrops.forEach(function(raindrop) {
        raindrop.x += raindrop.xOffset;
        raindrop.y += raindrop.yOffset;
        
        // recycle into new raindrop after leaving canvas
        if (raindrop.x > canvas.width ||
            raindrop.y > canvas.height) {
            var newRaindrop = this.initRaindrop(canvas);
            raindrop.x = newRaindrop.x;
            raindrop.y = newRaindrop.y;
            raindrop.xOffset = newRaindrop.xOffset;
            raindrop.yOffset = newRaindrop.yOffset;
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
