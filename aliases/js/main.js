// run when page is ready
$(function () {
    // configure callback for clicking generate button
    var $generateButton = $("#generate-button");
    $generateButton.click(function() {
        onClickGenerateButton();
    });
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
            $button.addClass("btn btn-light");
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
}

var onClickAliasButton = function($button, team) {
    // clear existing color and disable button
    $button.prop("disabled", true);
    $button.removeClass("btn-light");

    // set button color for alias team
    if (team === Team.NO_TEAM) {
        $button.addClass("btn-no-team");
    } else if (team === Team.BLUE_TEAM) {
        $button.addClass("btn-blue-team");
    } else if (team === Team.RED_TEAM) {
        $button.addClass("btn-red-team");
    } else if (team === Team.BLACK_ASSASSIN) {
        $button.addClass("btn-black-assassin");
    } else {
        // should not reach this case
        $button.addClass("btn-light");
    }
}
