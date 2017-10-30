// image names to load initially via URL
const IMAGE_NAMES = [
    "Collector",
    "Diamond",
    "Dirt"
];

// initialize image load-related parameters
var readyToStart = false;
var loadCheckInterval;
var canvas;
var context;
var imageMap;
var mouseX;

var main = function() {
    // configure canvas size
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    
    // track mouse/touch position for moving collector
    canvas.addEventListener("mousemove", function (e) {
        mouseX = e.clientX;
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        mouseX = e.clientX;
    }, false);
    
    // load images into map
    imageMap = loadImages(IMAGE_NAMES);
    
    // check if all images are loaded periodically (every 100 msec)
    loadCheckInterval = setInterval(function() {
        if (Object.keys(imageMap).length == Object.keys(IMAGE_NAMES).length) {
            clearInterval(loadCheckInterval);
            readyToStart = true;
        }
    }, 100);
    
    // start loop for updating/drawing each frame
    loop();
}

var restart = function() {
    window.location.reload(true);
}

// load each image from URL into map
var loadImages = function(names) {
    var imageMap = {};
    names.forEach(function(name) {
        var img = new Image();
        img.onload = function() {
            // store each image in map after loading
            imageMap[name] = img;
        };
        img.src = "img/" + name + ".png";
    });
    return imageMap;
}

// initialize frame loop-related parameters
const MIN_FRAME = 10; //msec
const MAX_FRAME = 50; //msec
const DIAMOND_RATE = 1000; //msec
const DIRT_RATE = 500; //msec
var frameTime = Date.now(); //msec
var gameTime = 0; //msec elapsed
var diamondTime = 0; //msec elapsed
var dirtTime = 0; //msec elapsed
var sprites = [];
var collector;

// run loop for each frame
var loop = function() {
    // determine delta time and update previous frame time
    const currTime = Date.now();
    const deltaTime = currTime - frameTime;
    const skipFrame = (deltaTime <= MIN_FRAME ||
        deltaTime >= MAX_FRAME);
    frameTime = currTime;
    
    if (readyToStart &&
        !skipFrame) {
        // update elapsed game time
        gameTime += deltaTime;
        
        // create single collector
        if (!collector) {
            collector = new Collector(canvas, imageMap);
        }
        
        // determine if time to create dirt
        const deltaDirt = (gameTime - dirtTime);
        if (deltaDirt >= DIRT_RATE) {
            dirtTime = gameTime;
            
            // create sprite from image map
            var dirt = new Dirt(canvas, imageMap);
            sprites.push(dirt);
        }
        
        // determine if time to create diamond
        const deltaDiamond = (gameTime - diamondTime);
        if (deltaDiamond >= DIAMOND_RATE) {
            diamondTime = gameTime;
            
            // create sprite from image map
            var diamond = new Diamond(canvas, imageMap);
            sprites.push(diamond);
        }
        
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // handle all existing sprites
        if (sprites.length > 0) {
            // update state of all sprites
            sprites.forEach(function(sprite) {
                sprite.update(canvas, sprites);
            });
            
            // draw all sprites
            sprites.forEach(function(sprite) {
                sprite.draw(context);
            });
        }
        
        // handle existing collector sprite separately
        collector.update(canvas, mouseX);
        collector.draw(context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(loop);
}
