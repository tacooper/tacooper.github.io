var disableButton = function($button, disable) {
    $button.prop("disabled", disable);
}

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
    // remove all existing button and text colors
    $button.removeClass("btn-light");
    $button.removeClass("btn-initial");
    $button.removeClass("btn-none-team");
    $button.removeClass("btn-blue-team");
    $button.removeClass("btn-red-team");
    $button.removeClass("btn-assassin");
    $button.removeClass("btn-none-team-text");
    $button.removeClass("btn-blue-team-text");
    $button.removeClass("btn-red-team-text");
    $button.removeClass("btn-assassin-text");
}

var initButton = function($button) {
    // clear existing colors
    resetButton($button);

    // add colors for initial state
    $button.addClass("btn-light btn-initial");

    // enable clicking button
    disableButton($button, false);
}

var setButtonForTeam = function($button, forceDisable) {
    var team = $button.data("team");
    var revealed = $button.data("revealed");

    // clear existing colors
    resetButton($button);

    if (revealed) {
        // set button color for revealed alias team
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
            $button.addClass("btn-light btn-initial");
        }

        // disable clicking button
        disableButton($button, true);
    } else {
        // reset team color and enable button
        initButton($button);

        // set text color for unrevealed alias team
        if (team === Team.NONE) {
            $button.addClass("btn-none-team-text");
        } else if (team === Team.BLUE) {
            $button.addClass("btn-blue-team-text");
        } else if (team === Team.RED) {
            $button.addClass("btn-red-team-text");
        } else if (team === Team.ASSASSIN) {
            $button.addClass("btn-assassin-text");
        } else {
            // should not reach this case
            $button.addClass("btn-light btn-initial");
        }

        if (forceDisable) {
            // disable clicking button
            disableButton($button, true);
        }
    }
}
