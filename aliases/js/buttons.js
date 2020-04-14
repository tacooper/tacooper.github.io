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

var resetButton = function($button) {
    // remove all existing colors
    $button.removeClass("btn-light");
    $button.removeClass("btn-none-team");
    $button.removeClass("btn-blue-team");
    $button.removeClass("btn-red-team");
    $button.removeClass("btn-assassin");
}

var initButton = function($button) {
    // clear existing color
    resetButton($button);

    // add color for initial state
    $button.addClass("btn-light");

    // enable clicking button
    $button.prop("disabled", false);
}

var setButtonForTeam = function($button, team) {
    // clear existing color
    resetButton($button);

    // set button color for alias team
    if (team === Team.NONE) {
        $button.addClass("btn-none-team");
    } else if (team === Team.BLUE) {
        $button.addClass("btn-blue-team");
    } else if (team === Team.RED) {
        $button.addClass("btn-red-team");
    } else if (team === Team.ASSASSIN) {
        $button.addClass("btn-assassin");
    } else {
        // should not reach this case
        $button.addClass("btn-light");
    }

    // disable clicking button
    $button.prop("disabled", true);
}
