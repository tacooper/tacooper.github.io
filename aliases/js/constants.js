// Aliases version number
const VERSION_NUMBER = "1.2.0";

// rules based on "Codenames" game
const NUM_COLUMNS = 5;
const NUM_ROWS = 5;
const NUM_ALIASES = NUM_COLUMNS * NUM_ROWS;
const NUM_NONE_TEAM = 7;
const NUM_BLUE_TEAM = 9;
const NUM_RED_TEAM = 8;

// enum for alias teams
const Team = {
    NONE: 0,
    BLUE: 1,
    RED: 2,
    ASSASSIN: 3,
};

// minimum pixel widths of page required to fit entire table of alias buttons
const MIN_PAGE_WIDTH_100 = NUM_COLUMNS * (150 + 2 * 12);
const MIN_PAGE_WIDTH_80 = 0.8 * MIN_PAGE_WIDTH_100;
