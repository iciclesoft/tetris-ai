var Shape = function (shape, gridX, gridY, ignoreLast) {
    if (!ignoreLast) {
        Shape.lastShape = shape;
    }
    this.identifier = shape;
    this.x = gridX;
    this.y = gridY;
    this.prevX = gridX;
    this.prevY = gridY;
    this.drawn = false;
    this.dir = 0;
    this.letter;

    this.matrix;
    this.currentMatrix;
    this.color;
    switch (shape) {
        case 0:
            this.o();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(255, 255, 0, 1);
            this.letter = "O";
            break;
        case 1:
            this.i();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(0, 255, 255, 1);
            this.letter = "I";
            break;
        case 2:
            this.j();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(0, 0, 255, 1);
            this.letter = "J";
            break;
        case 3:
            this.l();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(255, 128, 0, 1);
            this.letter = "L";
            break;
        case 4:
            this.s();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(0, 255, 0, 1);
            this.letter = "S";
            break;
        case 5:
            this.t();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(255, 0, 255, 1);
            this.letter = "T";
            break;
        case 6:
            this.z();
            this.currentMatrix = this.matrix[this.dir];
            this.color = new Color(255, 0, 0, 1);
            this.letter = "Z";
            break;
        default:
            throw "This shape hasn't been implemented yet";
    }
};

Shape.prototype.setDirection = function (dir) {
    this.dir = dir;
    this.currentMatrix = this.matrix[this.dir];
};

Shape.prototype.turnCW = function (grid) {
    // Temporarily remove the blocks and update the direction
    this.resetPreviousBlocks(grid);
    this.dir--;
    if (this.dir < 0) {
        this.dir = 3;
    }
    this.currentMatrix = this.matrix[this.dir];
    var possible = this.possibleMatrix(grid);
    if (!possible) {
        // Reset the direction
        this.dir++;
        if (this.dir > 3) {
            this.dir = 0;
        }
        this.currentMatrix = this.matrix[this.dir];
    }
    this.setCurrentBlocks(grid);
    return possible;
};

Shape.prototype.turnCCW = function (grid) {
    // Temporarily remove the blocks and update the direction
    this.resetPreviousBlocks(grid);
    this.dir++;
    if (this.dir > 3) {
        this.dir = 0;
    }
    this.currentMatrix = this.matrix[this.dir];
    var possible = this.possibleMatrix(grid);
    if (!possible) {
        // Reset the direction
        this.dir--;
        if (this.dir < 0) {
            this.dir = 3;
        }
        this.currentMatrix = this.matrix[this.dir];
    }
    this.setCurrentBlocks(grid);
    return possible;
};

Shape.prototype.possibleMatrix = function (grid) {
    for (var y = 0, lenY = this.currentMatrix.length; y < lenY; y++) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            var hasBlock = !!row[x];
            if (hasBlock) {
                var gridY = this.y + y;
                if (gridY >= grid.length) {
                    // Outside of the field
                    return false;
                }
                var gridX = this.x + x;
                if (gridY >= 0) {
                    var gridRow = grid[gridY];
                    if (gridX < 0 || gridX >= gridRow.length) {
                        // Outside of the field
                        return false;
                    }
                    if (grid[gridY][gridX].block) {
                        // Already a block here
                        return false;
                    }
                }
            }
        }
    }

    return true;
};

Shape.prototype.moveDown = function (grid) {
    this.updateGrid(grid);
    var found = [false, false, false, false];
    for (var y = this.currentMatrix.length - 1; y >= 0; y--) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            // Only check columns we haven't checked yet
            if (!found[x]) {
                var hasBlock = !!row[x];
                if (hasBlock) {
                    // If it has a block, check if it can move
                    found[x] = true;
                    var gridY = this.y + y + 1;
                    if (gridY >= 0) {
                        if (gridY >= grid.length) {
                            // Hit the floor
                            return false;
                        } else {
                            var gridX = this.x + x;
                            if (grid[gridY][gridX].block) {
                                // Hit another block
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }
    this.y++;
    return true;
};

Shape.prototype.moveLeft = function (grid) {
    for (var y = 0, lenY = this.currentMatrix.length; y < lenY; y++) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            var hasBlock = !!row[x];
            if (hasBlock) {
                // If it has a block, check if it can move
                var gridX = this.x + x - 1;
                if (gridX < 0) {
                    // Hit the side
                    return false;
                }
                var gridY = this.y + y;
                if (gridY >= 0 && grid[gridY][gridX].block) {
                    // Hit another block
                    return false;
                }
                // No need to check the next
                break;
            }
        }
    }
    this.x--;
    return true;
};

Shape.prototype.moveRight = function (grid) {
    for (var y = 0, lenY = this.currentMatrix.length; y < lenY; y++) {
        var row = this.currentMatrix[y];
        for (var x = row.length - 1; x >= 0; x--) {
            var hasBlock = !!row[x];
            if (hasBlock) {
                // If it has a block, check if it can move
                var gridX = this.x + x + 1;
                if (gridX >= grid[0].length) {
                    // Hit the side
                    return false;
                }
                var gridY = this.y + y;
                if (gridY >= 0) {
                    var gridRow = grid[gridY];
                    if (gridRow[gridX].block) {
                        // Hit another block
                        return false;
                    }
                }
                // No need to check the next
                break;
            }
        }
    }
    this.x++;
    return true;
};

Shape.prototype.updateGrid = function (grid) {
    // We only have to update the grid if anything changed
    if (this.x !== this.prevX || this.y !== this.prevY || !this.drawn) {
        this.resetPreviousBlocks(grid);
        this.setCurrentBlocks(grid);
        this.prevX = this.x;
        this.prevY = this.y;
        this.drawn = true;
    }
};

Shape.prototype.resetPreviousBlocks = function (grid) {
    for (var y = 0, lenY = this.currentMatrix.length; y < lenY; y++) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            var shown = !!row[x];
            if (shown) {
                var gridY = this.prevY + y;
                if (gridY >= 0) {
                    var gridX = this.prevX + x;
                    var gridBlock = grid[gridY][gridX];
                    gridBlock.block = false;
                }
            }
        }
    }
};

Shape.prototype.setCurrentBlocks = function (grid) {
    var block = { fillColor: this.color };
    for (var y = 0, lenY = this.currentMatrix.length; y < lenY; y++) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            var shown = !!row[x];
            if (shown) {
                var gridY = this.y + y;
                if (gridY >= 0) {
                    var gridX = this.x + x;
                    var gridBlock = grid[gridY][gridX];
                    gridBlock.block = block;
                }
            }
        }
    }
};

// Shape variables to decrease chance of same random
Shape.lastShape = undefined;
Shape.lastShapeChance = 3;

Shape.getRandom = function () {
    var rndm;
    if (Shape.lastShape) {
        // Max 4 times the same in a row
        var includeLast = parseInt(game.nextRandom() * 4) < Shape.lastShapeChance;
        if (!includeLast) {
            // Not included? Exclude the shape with a random of 6
            var temp = parseInt(game.nextRandom() * 6);
            if (temp >= Shape.lastShape) {
                temp++;
            }
            rndm = temp;
        }
    }
    // Random not set at this point, include all shapes
    if (typeof rndm === "undefined") {
        rndm = parseInt(game.nextRandom() * 7);
    }
    // Same shape? Decrease probability, otherwise reset
    if (rndm === Shape.lastShape) {
        Shape.lastShapeChance--;
    } else {
        Shape.lastShapeChance = 3;
    }
    return rndm;
};

Shape.ToHtml = function (shape) {
    switch (shape) {
        case "O":
            return "<span style='color: #FF0;'>O</span>";
            break;
        case "I":
            return "<span style='color: #0FF;'>I</span>";
            break;
        case "J":
            return "<span style='color: #00F;'>J</span>";
            break;
        case "L":
            return "<span style='color: #F80;'>L</span>";
            break;
        case "S":
            return "<span style='color: #0F0;'>S</span>";
            break;
        case "T":
            return "<span style='color: #F0F;'>T</span>";
            break;
        case "Z":
            return "<span style='color: #F00;'>Z</span>";
            break;
    }
};

Shape.prototype.toString = function () {
    return this.letter;
};

Shape.prototype.getFloorY = function () {
    var floorY = this.y;
    for (var y = this.currentMatrix.length - 1; y >= 0; y--) {
        var row = this.currentMatrix[y];
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            if (row[x]) {
                return floorY + y;
            }
        }
    }
};

Shape.prototype.o = function () {
    this.matrix = [[
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ]];
};

Shape.prototype.i = function () {
    this.matrix = [[
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
    ], [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0]
    ]];
};

Shape.prototype.j = function () {
    this.matrix = [[
        [1, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ]];
};

Shape.prototype.l = function () {
    this.matrix = [[
        [0, 0, 1, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]];
};

Shape.prototype.z = function () {
    this.matrix = [[
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 1, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [1, 0, 0, 0],
        [0, 0, 0, 0]
    ]];
};

Shape.prototype.t = function () {
    this.matrix = [[
        [0, 1, 0, 0],
        [1, 1, 1, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [1, 1, 1, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]];
};

Shape.prototype.s = function () {
    this.matrix = [[
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], [
        [0, 1, 0, 0],
        [0, 1, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 0]
    ], [
        [0, 0, 0, 0],
        [0, 1, 1, 0],
        [1, 1, 0, 0],
        [0, 0, 0, 0]
    ], [
        [1, 0, 0, 0],
        [1, 1, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 0, 0]
    ]];
};