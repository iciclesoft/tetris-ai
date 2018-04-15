var GeneticAlgorithm = function () {
    this.maxBlocks = 0;
    this.blocksIncrements = 5;
    this.currentBlock = 0;
    this.population = new Population();
    this.currentMove;
    this.currentDna = this.population.nextDna();
    this.dnaScore = 0;
    this.prevScore = 0;
    var prevGeneration = this.population.generation;
    var gameoverInGeneration = false;
    var scoredInGeneration = false;
    var newGame = false;
    // Init the callbacks
    game.resetCallbacks.push(function () {
        newGame = true;
    }.bind(this));
    preNewShapeCallbacks.push(function (shape) {
        var scoreDiff = game.getScore() - this.prevScore;
        this.prevScore = game.getScore();
        if (scoreDiff > 0) {
            this.dnaScore += scoreDiff;
        }
        if ((this.maxBlocks && this.currentBlock >= this.maxBlocks) || newGame) {
            this.currentDna = this.population.nextDna(this.currentBlock >= this.maxBlocks, this.dnaScore, this.maxBlocks);
            this.currentBlock = 0;
            this.dnaScore = 0;
            if (scoreDiff < 0) {
                gameoverInGeneration = true;
            } else if (scoreDiff > 0) {
                scoredInGeneration = true;
            }
            if (prevGeneration != this.population.generation) {
                prevGeneration = this.population.generation;
                if (!gameoverInGeneration && scoredInGeneration) {
                    this.maxBlocks += this.blocksIncrements;
                }
                gameoverInGeneration = false;
                scoredInGeneration = false;
            }
        }
    }.bind(this));
    postNewShapeCallbacks.push(function (shape) {
        this.currentBlock++;
        var bestMoves = [];
        var bestScore = -Infinity;
        // Get a new shape
        var shapeDir = new Shape(shape.identifier, shape.x, shape.y + 1, true);
        for (var i = 0; i < shape.currentMatrix.length; i++) {
            // Create a new copy every iteration
            var gridCopy = grid.map(function (row) {
                var copy = row.map(function (block) {
                    return new GridBlock(block);
                });
                return copy;
            });
            // Check every direction
            if (shapeDir.turnCW(gridCopy)) {
                // Clear the shape
                shapeDir.resetPreviousBlocks(gridCopy);
                // Check all left moves
                var shapeMove = new Shape(shape.identifier, shape.x + 1, shape.y, true);
                shapeMove.setDirection(shapeDir.dir);
                while (shapeMove.moveLeft(gridCopy)) {
                    // Move the shape all the way down
                    while (shapeMove.moveDown(gridCopy)) { }
                    // Get the score of this move
                    var score = this.currentDna.calcShapeScore(shapeMove, gridCopy, true);
                    if (score >= bestScore) {
                        if (score > bestScore) {
                            bestMoves = [];
                            bestScore = score;
                        }
                        bestMoves.push({
                            bestX: shapeMove.x,
                            bestDir: shapeDir.dir
                        });
                    }
                    // Remove the block prior to creating a new one
                    shapeMove.resetPreviousBlocks(gridCopy);
                    shapeMove = new Shape(shape.identifier, shapeMove.x, shape.y, true);
                    shapeMove.setDirection(shapeDir.dir);
                }
                // Clear the shape from the grid
                shapeMove.resetPreviousBlocks(gridCopy);
                // Check all right moves
                var shapeMove = new Shape(shape.identifier, shape.x, shape.y, true);
                shapeMove.setDirection(shapeDir.dir);
                while (shapeMove.moveRight(gridCopy)) {
                    // Move the shape all the way down
                    while (shapeMove.moveDown(gridCopy)) { }
                    // Get the score of this move
                    var score = this.currentDna.calcShapeScore(shapeMove, gridCopy, true);
                    if (score >= bestScore) {
                        if (score > bestScore) {
                            bestMoves = [];
                            bestScore = score;
                        }
                        bestMoves.push({
                            bestX: shapeMove.x,
                            bestDir: shapeDir.dir
                        });
                    }
                    // Remove the block prior to creating a new one
                    shapeMove.resetPreviousBlocks(gridCopy);
                    shapeMove = new Shape(shape.identifier, shapeMove.x, shape.y, true);
                    shapeMove.setDirection(shapeDir.dir);
                }
                // Again, clear the shape from the grid
                shapeMove.resetPreviousBlocks(gridCopy);
            }
        }
        // Get a random best move
        var rnd = bestMoves[parseInt(Math.random() * bestMoves.length)];
        if (rnd) {
            this.currentMove = new Moves(rnd.bestX, rnd.bestDir);
        } else {
            this.currentMove = new Moves(0, 0);
        }
        newGame = false;
    }.bind(this));
    setInterval(function () {
        if (unpaused && applyGravity) {
            if (this.currentMove) {
                this.currentMove.nextMove();
            }
        }
    }.bind(this), updateFreq / 3);
};