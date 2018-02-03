// constructor for class
var RetryButton = function(finalY) {
    // create stylesheet for button
    var css = document.createElement("link");
    css.type = "text/css";
    css.rel = "stylesheet";
    css.href = "css/carbon-button.css";
    document.head.appendChild(css);
    
    // create button
    var retryButton = document.createElement("input");
    retryButton.className = "carbonButton";
    retryButton.id = "retryButton";
    retryButton.type = "button";
    retryButton.value = "Try Again";
    retryButton.style.top = (finalY - 20) + "px";
    retryButton.onclick = restart;
    document.body.appendChild(retryButton);
}
