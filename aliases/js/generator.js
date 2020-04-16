var generateAliasList = function(gameId) {
    var aliasList = [];

    // generate MD5 hash from game ID and create seeded PRNG
    var hash = SparkMD5.hash(gameId);
    var seededGenerator = new Math.seedrandom(hash);

    // build list of indices for unique words
    var wordIndexList = [];
    for (var index = 0; index < NUM_ALIASES; ++index) {
        // determine each random index for next unused word
        var nextIndex;
        do {
            nextIndex = generateNext(seededGenerator, WORD_LIST.length);
        } while(wordIndexList.indexOf(nextIndex) > 0);

        // include random index in unique list
        wordIndexList.push(nextIndex);
    }

    // determine unique alias text and unassigned team for each button
    for (var index = 0; index < wordIndexList.length; ++index) {
        var alias = {
            team: Team.NONE,
            text: WORD_LIST[wordIndexList[index]],
        };

        aliasList.push(alias);
    }

    // assign single assassin team to random unassigned alias
    nextIndex = generateNext(seededGenerator, aliasList.length);
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
