// run when page is ready
$(function () {
    // initialize scaling for generated table of aliases
    scaleAliasTable();

    // display version number
    var $versionSpan = $("#version-span");
    $versionSpan.text("Version: " + VERSION_NUMBER);

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

    // configure callback for clicking end turn button
    var $endTurnButton = $("#end-turn-button");
    $endTurnButton.click(function() {
        // end turn for either current team
        toggleTurnButtons();
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

    // initialize style data for both turn buttons
    var $blueTurnButton = $("#blue-turn-button");
    $blueTurnButton.data("team", Team.BLUE);
    $blueTurnButton.data("revealed", true);
    var $redTurnButton = $("#red-turn-button");
    $redTurnButton.data("team", Team.RED);
    $redTurnButton.data("revealed", true);
});

var scaleAliasTable = function() {
    var pageWidth = $(window).width();

    // apply style for scaling table of aliases depending on page width
    var $aliasTable = $("#alias-table");
    if (pageWidth < MIN_PAGE_WIDTH_80) {
        $aliasTable.css("transform", "scale(0.5)");
    } else if (pageWidth < MIN_PAGE_WIDTH_100) {
        $aliasTable.css("transform", "scale(0.8)");
    } else {
        $aliasTable.css("transform", "");
    }
}

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

            // configure callback for clicking each alias button
            $button.click(function() {
                onClickAliasButton($(this));
            });
        }
    }

    // initialize turn buttons for always starting new game with blue team
    setTurnButtons(Team.BLUE);

    // set inputs for initial team counts
    var $blueTeamInput = $("#blue-team-input");
    $blueTeamInput.val(NUM_BLUE_TEAM);
    var $redTeamInput = $("#red-team-input");
    $redTeamInput.val(NUM_RED_TEAM);
}

var onClickAliasButton = function($button) {
    var team = $button.data("team");

    // set revealed team color and disable button
    $button.data("revealed", true);
    setButtonForTeam($button, false);

    if (team === Team.BLUE) {
        // reveal alias for blue team
        var $blueTeamInput = $("#blue-team-input");
        revealAlias($blueTeamInput, team);

        // set turn buttons for blue team
        setTurnButtons(team);
    } else if (team === Team.RED) {
        // reveal alias for red team
        var $redTeamInput = $("#red-team-input");
        revealAlias($redTeamInput, team);

        // set turn buttons for red team
        setTurnButtons(team);
    } else if (team === Team.ASSASSIN) {
        // end game for assassin
        endGame(team);
    } else {
        // end turn for either current team
        toggleTurnButtons();
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

var setTurnButtons = function(team) {
    // determine which turn button to highlight based on team
    var $offTurnButton;
    var $onTurnButton;
    if (team == Team.BLUE) {
        $offTurnButton = $("#red-turn-button");
        $onTurnButton = $("#blue-turn-button");
    } else {
        $offTurnButton = $("#blue-turn-button");
        $onTurnButton = $("#red-turn-button");
    }

    // update current turn data for both turn buttons
    $offTurnButton.data("current", false);
    $onTurnButton.data("current", true);

    // set revealed team color for next turn button and reset other button
    resetButton($offTurnButton);
    setButtonForTeam($onTurnButton, false);
}

var toggleTurnButtons = function() {
    // determine which button indicates current team's turn
    var $redTurnButton = $("#red-turn-button");
    var currentRedTurn = $redTurnButton.data("current");
    var nextTurnTeam = Team.RED;
    if (currentRedTurn) {
        nextTurnTeam = Team.BLUE;
    }

    // toggle turn buttons for next turn
    setTurnButtons(nextTurnTeam);
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
