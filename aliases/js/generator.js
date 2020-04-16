var generateAliasList = function(gameId) {
    var aliasList = [];

    // select sub-list of words for aliases
    var wordList = WORD_LIST.slice(0, 25);

    // determine alias text and unassigned team for each button
    for (var index = 0; index < NUM_ALIASES; ++index) {
        var alias = {
            team: Team.NONE,
            text: wordList[index],
        };

        aliasList.push(alias);
    }

    // generate MD5 hash from game ID and create seeded PRNG
    var hash = SparkMD5.hash(gameId);
    var seededGenerator = new Math.seedrandom(hash);

    // assign single assassin team to random unassigned alias
    var nextIndex = generateNext(seededGenerator, aliasList.length);
    aliasList[nextIndex].team = Team.ASSASSIN;

    // update list by assigning groups of both teams to random unassigned aliases
    assignAliasTeam(seededGenerator, aliasList, Team.BLUE, NUM_BLUE_TEAM);
    assignAliasTeam(seededGenerator, aliasList, Team.RED, NUM_RED_TEAM);

    return aliasList;
}

var assignAliasTeam = function(generator, aliasList, team, count) {
    for (var index = 0; index < count; ++index) {
        // determine each random index for next unassigned alias
        var nextIndex;
        do {
            nextIndex = generateNext(generator, aliasList.length);
        } while(aliasList[nextIndex].team !== Team.NONE);

        // assign team to each random unassigned alias
        aliasList[nextIndex].team = team;
    }
}

var generateNext = function(generator, maxValue) {
    // convert next generated float into integer in range [0, maxValue)
    var nextFloat = generator.quick();
    var nextInt = Math.floor(nextFloat * maxValue);

    return nextInt;
}
