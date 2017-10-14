// image URLs to load initially
const IMAGE_URLS = {
    diamond: "img/Diamond.png"
};

// initialize class
var Main = function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    
    // load images into map
    var imageMap = this.loadImages(IMAGE_URLS);
    
    // handle sprites each frame (every 10 ms)
    var sprites = [];
    setInterval(function() {
        // check if all images are loaded
        if (sprites.length == 0 &&
            Object.keys(imageMap).length == Object.keys(IMAGE_URLS).length) {
            // create sprites from images
            var diamond = new Diamond(context, canvas, imageMap["diamond"]);
            sprites.push(diamond);
        }
        
        // check if any sprites exist
        if (sprites.length > 0) {
            // clear canvas every frame
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // draw sprites every frame
            sprites.forEach(function(sprite) {
                sprite.draw();
            });
            
            // update state of sprites every frame
            sprites.forEach(function(sprite) {
                sprite.update();
            });
        }
    }, 10);
}

// load each image from URL into map
Main.prototype.loadImages = function(urls) {
    var imageMap = {};
    Object.keys(urls).forEach(function(id) {
        var url = IMAGE_URLS[id];
        var img = new Image();
        img.onload = function() {
            imageMap[id] = img;
            console.log(imageMap.length); //TODO
        };
        img.src = url;
    });
    return imageMap;
}

var main = new Main();
