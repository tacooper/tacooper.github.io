// image URLs to load initially
const IMAGE_URLS = {
    diamond: "img/Diamond.png"
};

var generateInterval;
var canvas;
var context;
var sprites = [];

var main = function() {
    // reset any existing intervals (in case of resize)
    clearInterval(generateInterval);
    
    // configure canvas size
    canvas = document.getElementById("mainCanvas");
    context = canvas.getContext("2d");
    canvas.width = document.documentElement.clientWidth;
	canvas.height = document.documentElement.clientHeight;
    
    // load images into map
    var imageMap = loadImages(IMAGE_URLS);
    
    // generate sprites periodically (every 1 sec)
    generateInterval = setInterval(function() {
        // check if all images are loaded
        if (Object.keys(imageMap).length == Object.keys(IMAGE_URLS).length) {
            // create sprites from images
            var diamond = new Diamond(context, canvas, imageMap["diamond"]);
            sprites.push(diamond);
        }
    }, 1000);
    
    // start loop for updating/drawing each frame
    loop();
}

// load each image from URL into map
var loadImages = function(urls) {
    var imageMap = {};
    Object.keys(urls).forEach(function(id) {
        var url = IMAGE_URLS[id];
        var img = new Image();
        img.onload = function() {
            // store each image in map after loading
            imageMap[id] = img;
            console.log("images loaded: " + Object.keys(imageMap).length); //TODO
        };
        img.src = url;
    });
    return imageMap;
}

var loop = function() {
    // handle existing sprites each frame
    if (sprites.length > 0) {
        // clear canvas each frame
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // update state of sprites each frame
        sprites.forEach(function(sprite) {
            sprite.update();
        });
        
        // draw sprites each frame
        sprites.forEach(function(sprite) {
            sprite.draw();
        });
    }
    
    // continue loop on next frame
    requestAnimationFrame(loop);
}
