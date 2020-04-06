const NUM_COLUMNS = 5;
const NUM_ROWS = 5;

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

    console.log("generate: " + gameId);

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
            $button.text(aliasList[aliasIndex]);
            $button.attr("id", "alias-button-" + rowIndex + "-" + columnIndex);
            $button.click(function() {
                console.log("id: " + $(this).attr("id"));
            });
            $cell.append($button);
        }
    }
}

var generateAliasList = function(gameId) {
    var aliasList = [];

    for (var buttonIndex = 0; buttonIndex < (NUM_ROWS * NUM_COLUMNS); ++buttonIndex) {
        // determine alias text for each button
        aliasList.push("TEST " + buttonIndex);
    }

    return aliasList;
}
