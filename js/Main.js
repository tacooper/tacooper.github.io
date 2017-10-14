// initialize class
var Main = function() {
    var canvas = document.getElementById("myCanvas");
    var context = canvas.getContext("2d");
    
    // create sprites
    var sprites = [];
    var diamond = new Diamond(context, canvas);
    sprites.push(diamond);
    
    // handle sprites each frame (every 10 ms)
    setInterval(function() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // draw sprites every frame
        sprites.forEach(function(sprite) {
            sprite.draw();
        });
        
        // update state of sprites every frame
        sprites.forEach(function(sprite) {
            sprite.update();
        });
    }, 10);
}

var main = new Main();
