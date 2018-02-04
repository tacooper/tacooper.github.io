// constructor for class
var FinishButton = function(finalY) {
    // create stylesheet for button
    var css = document.createElement("link");
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = "css/carbon-button.css";
    document.head.appendChild(css);
    
    // create button
    var finishButton = document.createElement("input");
    finishButton.className = "carbonButton";
    finishButton.id = "finishButton";
    finishButton.type = "button";
    finishButton.value = "Carbon";
    finishButton.style.top = (finalY - 50) + "px";
    finishButton.onclick = redirectToStory;
    document.body.appendChild(finishButton);
}

// redirect window to Carbon story page
var redirectToStory = function() {
    window.location.href = "Carbon.md";
}
