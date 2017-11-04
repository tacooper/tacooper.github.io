// image names to load initially via URL
const IMG_NAMES = [
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
var userPositionX;

var main = function() {
    // configure canvas size
    canvas = document.getElementById("mainCanvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    context = canvas.getContext("2d");
    
    // track mouse/touch position for moving collector
    canvas.addEventListener("mousemove", function (e) {
        userPositionX = e.clientX;
    }, false);
    canvas.addEventListener("touchmove", function (e) {
        userPositionX = e.touches[0].clientX;
    }, false);
    
    // load images into map
    imgMap = loadImages(IMG_NAMES);
    
    // check if all images are loaded periodically (every 100 msec)
    loadCheckInterval = setInterval(function() {
        if (Object.keys(imgMap).length == Object.keys(IMG_NAMES).length) {
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
    var imgMap = {};
    names.forEach(function(name) {
        var img = new Image();
        img.onload = function() {
            // store each image in map after loading
            imgMap[name] = img;
        };
        img.src = "img/" + name + ".png";
    });
    return imgMap;
}

// frame durations and update rates
const MIN_FRAME = 10; //msec
const MAX_FRAME = 50; //msec
const DIAMOND_RATE = 1000; //msec
const DIRT_RATE = 1000; //msec
const BACKGROUND_RATE = 200; //msec
const BACKGROUND_DELAY = 10000; //msec

// initialize frame loop-related parameters
var frameTime = Date.now(); //msec
var gameTime = 0; //msec elapsed
var diamondTime = 500; //msec elapsed
var dirtTime = 0; //msec elapsed
var backgroundTime = 0; //msec elapsed
var sprites = [];
var collector;
var backgroundColorIndex = 0;

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
            collector = new Collector(canvas, imgMap);
        }
        
        // determine if time to change background color
        const deltaBackground = (gameTime - backgroundTime);
        if (gameTime >= BACKGROUND_DELAY &&
            deltaBackground >= BACKGROUND_RATE) {
            backgroundTime = gameTime;
            
            ++backgroundColorIndex;
        }
        
        // determine if time to create dirt
        const deltaDirt = (gameTime - dirtTime);
        if (deltaDirt >= DIRT_RATE) {
            dirtTime = gameTime;
            
            // create sprite from image map
            var dirt = new Dirt(canvas, imgMap);
            sprites.push(dirt);
        }
        
        // determine if time to create diamond
        const deltaDiamond = (gameTime - diamondTime);
        if (deltaDiamond >= DIAMOND_RATE) {
            diamondTime = gameTime;
            
            // create sprite from image map
            var diamond = new Diamond(canvas, imgMap);
            sprites.push(diamond);
        }
        
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // set background color (fade from black to yellow)
        if (backgroundColorIndex > 255) {
            backgroundColorIndex = 255;
        }
        const backgroundColor = "#" +
            decToHex(backgroundColorIndex, 2) +
            decToHex(Math.round(0.75 * backgroundColorIndex), 2) +
            decToHex(Math.round(0.5 * backgroundColorIndex), 2);
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // update all existing sprites
        if (sprites.length > 0) {
            sprites.forEach(function(sprite) {
                sprite.update(canvas, sprites);
            });
        }
        
        // update existing collector sprite separately
        collector.update(canvas, sprites, userPositionX);
        
        // draw all existing sprites
        if (sprites.length > 0) {
            sprites.forEach(function(sprite) {
                sprite.draw(context);
            });
        }
        
        // draw existing collector sprite separately
        collector.draw(context);
    }
    
    // continue loop on next frame
    requestAnimationFrame(loop);
}

var decToHex = function(dec, padding) {
    var hex = Number(dec).toString(16);
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}
