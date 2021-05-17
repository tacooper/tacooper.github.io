var selectButton = function($button, select) {
    if (select) {
        // select this button
        $button.removeClass("btn-light");
        $button.addClass("btn-primary");
    } else {
        // deselect this button
        $button.removeClass("btn-primary");
        $button.addClass("btn-light");
    }
}
