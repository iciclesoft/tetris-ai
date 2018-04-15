var PatternFinder = function () {
    this.patHeight = grid.length;
};

PatternFinder.prototype.getPatterns = function () {
    var curPattern = [];
    // Beneath the floor, all blocks are considered true
    for (var x = 0, lenX = grid[0].length; x < lenX; x++) {
        curPattern.push(true);
    }
    for (var patY = grid.length - 1; patY >= 0; patY--) {
        var gridRow = grid[patY];
        for (var x = 0, lenX = gridRow.length; x < lenX; x++) {
            var cell = gridRow[x];
            curPattern.push(!!cell.block);
        }
    }

    return pattern;
};

PatternFinder.prototype.patternToHtml = function (pattern) {
    var result = "";
    var pos = "<span style='color: #000;'>o</span>";
    var neg = "<span style='color: #FFF;'>o</span>";
    var rowLen = grid[0].length;
    for (var y = 0, lenY = pattern.length; y < lenY; y++) {
        if (y % rowLen == 0) {
            result += "<br />";
        }
        if (pattern[y]) {
            result += pos;
        } else {
            result += neg;
        }
    }
    return result;
};

PatternFinder.prototype.toString = function (pattern) {
    var result = "";
    var pos = "1";
    var neg = "0";
    var rowLen = grid[0].length;
    for (var y = 0, lenY = pattern.length; y < lenY; y++) {
        if (pattern[y]) {
            result += pos;
        } else {
            result += neg;
        }
    }
    return result;
};