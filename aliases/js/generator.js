// generate list of aliases for populating all buttons
// TODO: use game ID for unique list
var generateAliasList = function(gameId) {
    var aliasList = [];

    // generate list of teams for aliases
    var teamList = [];
    for (var index = 0; index < NUM_NO_TEAM; ++index) {
        teamList.push(Team.NO_TEAM);
    }
    for (var index = 0; index < NUM_BLUE_TEAM; ++index) {
        teamList.push(Team.BLUE_TEAM);
    }
    for (var index = 0; index < NUM_RED_TEAM; ++index) {
        teamList.push(Team.RED_TEAM);
    }
    teamList.push(Team.BLACK_ASSASSIN);

    // determine alias text and team for each button
    for (var buttonIndex = 0; buttonIndex < (NUM_ROWS * NUM_COLUMNS); ++buttonIndex) {
        var alias = {
            text: "TEST " + buttonIndex,
            team: teamList[buttonIndex],
        };

        aliasList.push(alias);
    }

    return aliasList;
}
