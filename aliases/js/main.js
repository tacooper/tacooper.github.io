// run when page is ready
$(function () {
    // configure callback for clicking generate button
    var $generateButton = $("#generate-button");
    $generateButton.click(function() {
        // generate table with all alias buttons
        onClickGenerateButton();

        // enforce selecting player mode if previously in spymaster mode
        var $playerButton = $("#player-button");
        $playerButton.click();
    });

    // configure callback for clicking player button
    var $playerButton = $("#player-button");
    $playerButton.click(function() {
        // deselect other mode
        $spymasterButton.removeClass("btn-primary");
        $spymasterButton.addClass("btn-light");

        onClickPlayerButton($(this));
    });

    // configure callback for clicking spymaster button
    var $spymasterButton = $("#spymaster-button");
    $spymasterButton.click(function() {
        // deselect other mode
        $playerButton.removeClass("btn-primary");
        $playerButton.addClass("btn-light");

        onClickSpymasterButton($(this));
    });

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

            // create and add each button to cell
            var $button = $("<button>");
            $button.attr("type", "button");
            $button.addClass("btn btn-light alias-button");
            $button.text(aliasList[aliasIndex].text);
            $button.attr("id", "alias-button-" + rowIndex + "-" + columnIndex);
            $button.data("team", aliasList[aliasIndex].team);
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
    // set team color and disable button
    setButtonForTeam($button, team);

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
    $button.removeClass("btn-light");
    $button.addClass("btn-primary");

    // initialize to hide team for each alias button
    for (var rowIndex = 0; rowIndex < NUM_ROWS; ++rowIndex) {
        for (var columnIndex = 0; columnIndex < NUM_COLUMNS; ++columnIndex) {
            // reset team color and enable button
            var $button = $("#alias-button-" + rowIndex + "-" + columnIndex);
            initButton($button);
        }
    }
}

var onClickSpymasterButton = function($button) {
    // select this button
    $button.removeClass("btn-light");
    $button.addClass("btn-primary");

    // reveal team for each alias button
    for (var rowIndex = 0; rowIndex < NUM_ROWS; ++rowIndex) {
        for (var columnIndex = 0; columnIndex < NUM_COLUMNS; ++columnIndex) {
            // set team color and disable button
            var $button = $("#alias-button-" + rowIndex + "-" + columnIndex);
            setButtonForTeam($button, $button.data("team"));
        }
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
    var $endGameSpan = $("#end-game-span");

    // display message depending on revealed alias
    if (team === Team.BLUE) {
        $endGameSpan.text("Blue team wins!");
    } else if (team === Team.RED) {
        $endGameSpan.text("Red team wins!");
    } else if (team === Team.ASSASSIN) {
        // TODO: display based on which team clicks
        $endGameSpan.text("Blue/Red team loses!");
    }
}
