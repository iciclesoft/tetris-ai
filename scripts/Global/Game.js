var Game = function () {
    this.resetCallbacks = [];
    var highestScore = 0;
    var score = 0;
    var linesCleared = 0;
    var level = 1;
    var scorePerBar = [40, 100, 300, 1200];

    this.checkScored = function (grid) {
        var fullBars = [];
        for (var y = 0, lenY = grid.length; y < lenY; y++) {
            var row = grid[y];
            var full = true;
            for (var x = 0, lenX = row.length; x < lenX; x++) {
                var cell = row[x];
                if (!cell.block) {
                    full = false;
                    break;
                }
            }
            if (full) {
                fullBars.push(y);
            }
        }
        var count = fullBars.length;
        if (count) {
            score += (scorePerBar[count - 1] * (count + 1)) * level;
            linesCleared += count;
            return fullBars;
        }
        return;
    };

    this.getScore = function () {
        return score;
    };

    this.getLevel = function () {
        return level;
    };

    this.getLinesCleared = function () {
        return linesCleared;
    }

    this.reset = function () {
        applyGravity = true;
        if (score > highestScore) {
            highestScore = score;
            $("#high-score").html("Highest score: " + highestScore);
        }
        score = 0;
        stats = new Stats();
        for (var i = 0, len = this.resetCallbacks.length; i < len; i++) {
            var callback = this.resetCallbacks[i];
            callback();
        }
        Shape.lastShape = undefined;
        Shape.lastShapeChance = 3;
        Game.RNG = new RNG(seed);
    };
};

// When the seed is zero, no seed is used
var seed = 0;
Game.RNG = new RNG(seed);

Game.prototype.nextRandom = function () {
    if (seed > 0) {
        return Game.RNG.nextFloat();
    } else {
        return Math.random();
    }
};

Game.prototype.moveLeft = function () {
    if (applyGravity && shape) {
        shape.moveLeft(grid);
    }
};

Game.prototype.moveRight = function () {
    if (applyGravity && shape) {
        shape.moveRight(grid);
    }
};

Game.prototype.moveDown = function () {
    if (applyGravity && shape) {
        if (shape.moveDown(grid)) {
            // Reset lastUpdated on a succesful move-down
            lastUpdated = Date.now();
        }
    }
};

Game.prototype.hardDrop = function () {
    if (shape && shape.y >= 0) {
        applyGravity = false;
        var done = false;
        var interval = setInterval(function () {
            if (unpaused) {
                if (shape && shape.moveDown(grid)) {
                    // Reset lastUpdated only if we can move down
                    lastUpdated = Date.now();
                } else {
                    clearInterval(interval);
                    applyGravity = true;
                }
            }
        }, 90 / speed);
    }
};

Game.prototype.turnCW = function () {
    if (applyGravity && shape) {
        shape.turnCW(grid);
    }
};

Game.prototype.turnCCW = function () {
    if (applyGravity && shape) {
        shape.turnCCW(grid);
    }
};

Game.prototype.removeBarsAnimation = function (grid, fullBars, callback) {
    var horCellsCleared = 0;
    var interval = setInterval(function () {
        if (unpaused) {
            if (horCellsCleared < xCount) {
                var halfCellsCleared = parseInt(horCellsCleared * .5);
                var leftX = 4 - halfCellsCleared;
                var rightX = 5 + halfCellsCleared;
                for (var index = 0, len = fullBars.length; index < len; index++) {
                    var y = fullBars[index];
                    grid[y][leftX].block = false;
                    grid[y][rightX].block = false;
                }
                horCellsCleared += 2;
            } else {
                // Done
                clearInterval(interval);
                // Lower all removed lines
                for (var index = 0, len = fullBars.length; index < len; index++) {
                    var untilY = fullBars[index];
                    for (var y = untilY; y > 0; y--) {
                        var prevRow = grid[y - 1];
                        var row = grid[y];
                        for (var x = 0, lenX = row.length; x < lenX; x++) {
                            row[x].block = prevRow[x].block;
                        }
                    }
                    // Fill the top row with empty blocks
                    var topRow = grid[0];
                    for (var x = 0, lenX = topRow.length; x < lenX; x++) {
                        var gridX = x * gridWH;
                        var gridY = 0;
                        topRow[x] = new GridBlock(gridX, gridY, gridWH, gridWH);
                    }
                }
                callback();
            }
        }
    }, 90 / speed);
};

Game.prototype.endAnimation = function () {
    var max = grid.length - 1;
    var current = 0;
    canDraw = false;
    applyGravity = false;
    var callback = function () {
        if (current == max) {
            this.reset();
        } else {
            current++;
            this.removeBarsAnimation(grid, [current], callback.bind(this));
        }
    };
    var textTimer = 0;
    var textTimerGoal = 4000;
    var text = "GAME OVER";
    var textInterval = setInterval((function () {
        textTimer += 200;
        var iteration = textTimer / 200;
        var incrPx = (iteration / 2);
        var fontsize = 56 + incrPx;
        var subText = text.substr(0, iteration);
        // Black text
        ctx.font = fontsize + 2 + "px sans-serif";
        ctx.fillColor(0, 0, 0, 1);
        ctx.fillText(subText, 1 - (incrPx / 2), (cnv.height / 2) + (incrPx / 2));
        // White text
        ctx.font = fontsize + "px sans-serif";
        ctx.fillColor(255, 255, 255, 1);
        ctx.fillText(subText, 2 - (incrPx / 2), (cnv.height / 2) + (incrPx / 2));
        if (textTimer >= textTimerGoal) {
            canDraw = true;
            clearInterval(textInterval);
            this.removeBarsAnimation(grid, [current], callback.bind(this));
        }
    }).bind(this), 600 / speed);
};