// image names to load initially via URL
const IMG_NAMES = [
    "Collector",
    "Diamond",
    "Dirt"
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

// convert decimal number into hex padded string
var decToHex = function(dec, padding) {
    var hex = Number(dec).toString(16);
    while (hex.length < padding) {
        hex = "0" + hex;
    }
    return hex;
}
