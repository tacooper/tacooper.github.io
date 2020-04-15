// TODO: use game ID for unique list
var generateAliasList = function(gameId) {
    var aliasList = [];

    // generate list of teams for aliases
    var teamList = [];
    for (var index = 0; index < NUM_NONE_TEAM; ++index) {
        teamList.push(Team.NONE);
    }
    for (var index = 0; index < NUM_BLUE_TEAM; ++index) {
        teamList.push(Team.BLUE);
    }
    for (var index = 0; index < NUM_RED_TEAM; ++index) {
        teamList.push(Team.RED);
    }
    teamList.push(Team.ASSASSIN);

    // select list of words for aliases
    var wordList = WORD_LIST;

    // determine alias text and team for each button
    for (var buttonIndex = 0; buttonIndex < (NUM_ROWS * NUM_COLUMNS); ++buttonIndex) {
        var alias = {
            text: wordList[buttonIndex],
            team: teamList[buttonIndex],
        };

        aliasList.push(alias);
    }

    return aliasList;
}
