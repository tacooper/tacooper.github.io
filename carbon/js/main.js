// image names to load initially via URL
const IMG_NAMES = [
    "Collector",
    "Diamond",
    "Dirt",
    "Flowerpot",
    "Rainbow"
];

// initialize global main parameters
var loadedAllImages = false;
var imgMap;
var userPositionX;

// main setup
var main = function() {
    // configure canvas size
    var canvas = document.getElementById("mainCanvas");
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    var context = canvas.getContext("2d");
    
    // start tracking mouse/touch position for moving collector
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("touchmove", handleTouchMove, false);
    
    // load images into map
    imgMap = loadImages(IMG_NAMES);
    
    // check if all images are loaded periodically (every 100 msec)
    var loadCheckInterval = setInterval(function() {
        if (Object.keys(imgMap).length == Object.keys(IMG_NAMES).length) {
            clearInterval(loadCheckInterval);
            loadedAllImages = true;
        }
    }, 100);
    
    // enter collection scene loop after main setup
    // (waits until all images are loaded)
    var scene = new CollectionScene(canvas);
    scene.loop();
}

// track mouse position
var handleMouseMove = function(e) {
    userPositionX = e.clientX;
}

// track touch position
var handleTouchMove = function(e) {
    userPositionX = e.touches[0].clientX;
}

// force reload when resizing or reorienting window
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
