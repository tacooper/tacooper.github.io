// image names to load initially via URL
const IMAGE_NAMES = [
    "Diamond",
    "Dirt"
];

// initialize image load-related parameters
var readyToStart = false;
var loadCheckInterval;
var canvas;
var context;
var imageMap;

var main = function() {
    // configure canvas size
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    
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

var resize = function() {
    // reconfigure canvas size
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
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
var frameTime = Date.now(); //msec
var gameTime = 0; //msec elapsed
var diamondTime = 0; //msec elapsed
var sprites = [];

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
        
        // determine if time to create diamond
        const deltaDiamond = (gameTime - diamondTime);
        if (deltaDiamond >= DIAMOND_RATE) {
            diamondTime = gameTime;
            
            // create sprite from image map
            var diamond = new Diamond(canvas, imageMap);
            sprites.push(diamond);
        }
        
        // handle all existing sprites
        if (sprites.length > 0) {
            // clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // update state of all sprites
            sprites.forEach(function(sprite) {
                sprite.update(canvas, sprites);
            });
            
            // draw all sprites
            sprites.forEach(function(sprite) {
                sprite.draw(context);
            });
        }
    }
    
    // continue loop on next frame
    requestAnimationFrame(loop);
}
