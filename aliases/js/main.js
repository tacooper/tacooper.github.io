// run when page is ready
$(function () {
    // configure callback for clicking generate button
    var $generateButton = $("#generate-button");
    $generateButton.click(function() {
        // clear message before starting game
        var $startGameSpan = $("#start-game-span");
        $startGameSpan.empty();

        // generate table with all alias buttons
        onClickGenerateButton();

        // enable clicking both mode buttons
        disableButton($playerButton, false);
        disableButton($spymasterButton, false);

        // enforce selecting player mode if previously in spymaster mode
        selectButton($playerButton, true);
        selectButton($spymasterButton, false);

        // reset message from previously ended game
        var $endGameButton = $("#end-game-button");
        $endGameButton.text("");
        resetButton($endGameButton);
    });

    // configure callback for clicking player button
    var $playerButton = $("#player-button");
    $playerButton.click(function() {
        // deselect other mode
        selectButton($spymasterButton, false);

        onClickPlayerButton($(this));
    });

    // configure callback for clicking spymaster button
    var $spymasterButton = $("#spymaster-button");
    $spymasterButton.click(function() {
        // deselect other mode
        selectButton($playerButton, false);

        onClickSpymasterButton($(this));
    });

    // disable clicking both mode buttons
    disableButton($playerButton, true);
    disableButton($spymasterButton, true);

    // reset team count inputs to zero
    var $blueTeamInput = $("#blue-team-input");
    $blueTeamInput.val(0);
    var $redTeamInput = $("#red-team-input");
    $redTeamInput.val(0);
});

var onClickGenerateButton = function() {
    // get game ID from input
    var $gameIdInput = $("#game-id-input");
    var gameId = $gameIdInput.val();

    // generate alias list from game ID
    var aliasList = generateAliasList(gameId);

    // clear existing table of alias buttons
    var $aliasTable = $("#alias-table");
    $aliasTable.empty();

    for (var rowIndex = 0; rowIndex < NUM_ROWS; ++rowIndex) {
        // create and add each row to table body
        var $row = $("<tr>");
        $aliasTable.append($row);

        for (var columnIndex = 0; columnIndex < NUM_COLUMNS; ++columnIndex) {
            var aliasIndex = (rowIndex * NUM_COLUMNS) + columnIndex;

            // create and add each column cell to row
            var $cell = $("<td>");
            $row.append($cell);

            // create and add each unrevealed button to cell
            var $button = $("<button>");
            $button.attr("type", "button");
            $button.addClass("btn btn-light alias-button");
            $button.text(aliasList[aliasIndex].text);
            $button.attr("id", "alias-button-" + aliasIndex);
            $button.data("team", aliasList[aliasIndex].team);
            $button.data("revealed", false);
            $cell.append($button);

            // configure callback for clicking each button
            $button.click(function() {
                // handle changing color for alias team
                var team = $(this).data("team");
                onClickAliasButton($(this), team);
            });
        }
    }

    // set inputs for initial team counts
    var $blueTeamInput = $("#blue-team-input");
    $blueTeamInput.val(NUM_BLUE_TEAM);
    var $redTeamInput = $("#red-team-input");
    $redTeamInput.val(NUM_RED_TEAM);
}

var onClickAliasButton = function($button, team) {
    // set revealed team color and disable button
    $button.data("revealed", true);
    setButtonForTeam($button, false);

    if (team === Team.BLUE) {
        // reveal alias for blue team
        var $blueTeamInput = $("#blue-team-input");
        revealAlias($blueTeamInput, team)
    } else if (team === Team.RED) {
        // reveal alias for red team
        var $redTeamInput = $("#red-team-input");
        revealAlias($redTeamInput, team)
    } else if (team === Team.ASSASSIN) {
        // end game for assassin
        endGame(team);
    }
}

var onClickPlayerButton = function($button) {
    // select this button
    selectButton($button, true);

    // initialize to hide team for each alias button
    for (var aliasIndex = 0; aliasIndex < NUM_ALIASES; ++aliasIndex) {
        var $button = $("#alias-button-" + aliasIndex);

        // only hide team for alias that hasn't already been revealed
        var revealed = $button.data("revealed");
        if (!revealed) {
            // reset team color and enable button
            initButton($button);
        }
    }
}

var onClickSpymasterButton = function($button) {
    // select this button
    selectButton($button, true);

    // show team text color for each alias button
    for (var aliasIndex = 0; aliasIndex < NUM_ALIASES; ++aliasIndex) {
        // set team text color for unrevealed aliases only
        var $button = $("#alias-button-" + aliasIndex);
        setButtonForTeam($button, false);
    }
}

var revealAlias = function($input, team) {
    // decrease team count when revealing alias
    var finalCount = $input.val() - 1;
    $input.val(finalCount);

    // end game if final alias on team is revealed
    if (finalCount === 0) {
        endGame(team);
    }
}

var endGame = function(team) {
    // set team color depending on revealed alias
    var $endGameButton = $("#end-game-button");
    $endGameButton.data("team", team);
    $endGameButton.data("revealed", true);
    setButtonForTeam($endGameButton, false);

    // display message depending on revealed alias
    if (team === Team.BLUE) {
        $endGameButton.text("Game over: Blue team wins!");
    } else if (team === Team.RED) {
        $endGameButton.text("Game over: Red team wins!");
    } else if (team === Team.ASSASSIN) {
        $endGameButton.text("Game over: Assassin found!");
    }

    // disable clicking both mode buttons
    var $playerButton = $("#player-button");
    var $spymasterButton = $("#spymaster-button");
    disableButton($playerButton, true);
    disableButton($spymasterButton, true);

    // determine if spymaster mode is not selected
    var spymaster = $spymasterButton.hasClass("btn-primary");
    if (!spymaster) {
        // enforce selecting spymaster mode if previously in player mode
        selectButton($playerButton, false);
        selectButton($spymasterButton, true);
    }

    // show team text color for each alias button
    for (var aliasIndex = 0; aliasIndex < NUM_ALIASES; ++aliasIndex) {
        // force disabling button and set team text color for unrevealed aliases only
        var $button = $("#alias-button-" + aliasIndex);
        setButtonForTeam($button, true);
    }
}
