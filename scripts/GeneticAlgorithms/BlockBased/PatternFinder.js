var PatternFinder = function () {
    this.patHeight = grid.length;
};

PatternFinder.prototype.getPatterns = function () {
    var result = [];
    // Start one line beneath the floor
    var beneathFloor = true;
    var startY = this.firstRelevantRow() + 1;
    var foundEmpty = false;
    for (var y = grid.length; y >= this.patHeight; y--) {
        var curPattern = [];
        for (var patY = y, minY = y - this.patHeight; patY >= minY; patY--) {
            var row = [];
            // Beneath the floor, all blocks are considered true
            if (beneathFloor) {
                beneathFloor = false;
                for (var x = 0, lenX = grid[0].length; x < lenX; x++) {
                    row.push(true);
                }
            } else {
                var gridRow = grid[patY];
                for (var x = 0, lenX = gridRow.length; x < lenX; x++) {
                    var cell = gridRow[x];
                    row.push(!!cell.block);
                }
                if (!this.countTrues(row)) {
                    foundEmpty = true;
                }
            }
            // For the floor, set roofed-blocks to false, as they are irrelevant
            if (patY == y) {
                var roof = grid[patY - 1];
                for (var x = 0, lenX = roof.length; x < lenX; x++) {
                    if (roof[x].block) {
                        row[x] = false;
                    }
                }
            }
            curPattern = curPattern.concat(row);
        }
        var pattern = {
            from: y,
            to: y - this.patHeight,
            bitmap: curPattern
        };
        result.push(pattern);
        // If we've found an empty row, stop
        if (foundEmpty) {
            break;
        }
    }

    return result;
};

PatternFinder.prototype.patternToHtml = function (bitmap) {
    var result = "";
    var pos = "<span style='color: #000;'>o</span>";
    var neg = "<span style='color: #FFF;'>o</span>";
    var rowLen = grid[0].length;
    for (var y = 0, lenY = bitmap.length; y < lenY; y++) {
        if (y % rowLen == 0) {
            result += "<br />";
        }
        if (bitmap[y]) {
            result += pos;
        } else {
            result += neg;
        }
    }
    return result;
};

PatternFinder.prototype.toString = function (bitmap) {
    var result = "";
    var pos = "1";
    var neg = "0";
    var rowLen = grid[0].length;
    for (var y = 0, lenY = bitmap.length; y < lenY; y++) {
        if (bitmap[y]) {
            result += pos;
        } else {
            result += neg;
        }
    }
    return result;
};

PatternFinder.prototype.firstRelevantRow = function () {
    // Rows we can't score with at this moment are considered irrelevant
    var rowSize = grid[0].length;
    var xBlocks = new Array(rowSize);
    var firstRelevant = grid.length - 1;
    for (var y = firstRelevant; y >= 0; y--) {
        var row = grid[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            if (row[x].block) {
                xBlocks[x] = true;
                if (this.countTrues(xBlocks) === rowSize) {
                    xBlocks = new Array(rowSize);
                    y = firstRelevant;
                    firstRelevant--;
                    break;
                }
            }
        }
    }
    return firstRelevant;
};

PatternFinder.prototype.countTrues = function (arr) {
    var count = 0;
    for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i]) {
            count++;
        }
    }
    return count;
};