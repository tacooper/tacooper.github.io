// constructor for abstract class
var Scene = function(canvas) {
    if (this.constructor === Scene) {
        console.error("Scene is instantiated as abstract class");
    }
    
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
}

// frame duration limits
const MIN_FRAME = 10; //msec
const MAX_FRAME = 50; //msec

// run loop every frame
Scene.prototype.loop = function() {
    console.error("Scene.loop is unimplemented abstract method");
}
