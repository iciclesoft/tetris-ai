var DNA = function () {
    // Weights can be a number between -1 and +1
    // Powweights a number between 0 and +1
    this.weights = {
        //heightWeight: -1 + (Math.random() * 2),
        //heightPowWeight: -1 + (Math.random() * 2),
        //lineWeight: -1 + (Math.random() * 2),
        //linePowWeight: -1 + (Math.random() * 2),
        //roofThicknessWeight: -1 + (Math.random() * 2),
        //roofThicknessPowWeight: -1 + (Math.random() * 2),
        //roofHeightWeight: -1 + (Math.random() * 2),
        //roofHeightPowWeight: -1 + (Math.random() * 2),
        //adjacencyWeight: -1 + (Math.random() * 2),
        //adjacencyPowWeight: -1 + (Math.random() * 2),
        //potentialWeight: -1 + (Math.random() * 2),
        //potentialPowWeight: -1 + (Math.random() * 2),

        heightWeight: -1 + (Math.random() * 2),
        //heightPowWeight: Math.random(),
        roofThicknessWeight: -1 + (Math.random() * 2),
        //roofThicknessPowWeight: Math.random(),
        roofHeightWeight: -1 + (Math.random() * 2),
        //roofHeightPowWeight: Math.random(),
        adjacencyWeight: -1 + (Math.random() * 2),
        //adjacencyPowWeight: Math.random(),
        wellWeight: -1 + (Math.random() * 2),
        //wellPowWeight: Math.random(),
        lineWeight: -1 + (Math.random() * 2),
        //linePowWeight: Math.random(),
        potentialWeight: -1 + (Math.random() * 2),
        //potentialPowWeight: Math.random(),
    };

    this.reachedEnd = false;
    this.scored = 0;
};

DNA.weightCount = Object.keys(new DNA().weights).length;

DNA.prototype.crossover = function (dna, conversionPoint) {
    var newDna = new DNA();
    var even = 0;
    var takeThis;
    for (var weight in this.weights) {
        if (this.weights.hasOwnProperty(weight)) {
            // Take both the normal- and the power-weights of one, as these are related
            //if (even % 2 == 0) {
            takeThis = Math.random() < conversionPoint;
            //}
            //even++;
            if (takeThis) {
                newDna.weights[weight] = this.weights[weight];
            } else {
                newDna.weights[weight] = dna.weights[weight];
            }
            // Either get the weight from the first or the second
            //if (Math.random() < .5) {
            //    newDna.weights[weight] = this.weights[weight];
            //} else {
            //    newDna.weights[weight] = dna.weights[weight];
            //}
        }
    }

    return newDna;
};

DNA.prototype.mutate = function (mutationRate) {
    for (var weight in this.weights) {
        if (this.weights.hasOwnProperty(weight)) {
            if (Math.random() < mutationRate) {
                // Completely replace a weight if mutated
                this.weights[weight] = -1 + (Math.random() * 2);

                //// Slightly tweak the weight (max 20% of current in either direction)
                ////this.weights[weight] = this.weights[weight] * (1 + (-.2 + (Math.random() * .4)));

                //// Slightly tweak the weight (max .2 either direction)
                //this.weights[weight] = this.weights[weight] + (-.2 + (Math.random() * .4));

                // Pow weights shouldn't be lower than 0
                if (this.weights[weight] < 0 && ~weight.indexOf("PowWeight")) {
                    this.weights[weight] = Math.abs(this.weights[weight]);
                }
            }
        }
    }
};

DNA.prototype.calcShapeScore = function (shape, grid, calcPotential) {
    // Height score
    var heightScore = 0;
    var maxHeight = 19 * 4;
    for (var y = 0, lenY = shape.currentMatrix.length; y < lenY; y++) {
        var matrixY = shape.currentMatrix[y];
        for (var x = 0, lenX = matrixY.length; x < lenX; x++) {
            if (matrixY[x]) {
                heightScore += shape.y + y;
            }
        }
    }
    heightScore = heightScore / maxHeight;
    // Roofing score
    var roofThicknessScore = 0;
    var maxRoofThickness = 19 * 4;
    var roofHeightScore = 0;
    var maxRoofHeight = 19 * 3;
    // Get the x-position per block
    for (var x = 0, lenX = shape.currentMatrix[0].length; x < lenX; x++) {
        var roofThickness = 0;
        for (var y = 0, lenY = shape.currentMatrix.length; y < lenY; y++) {
            // Find a block in this column
            var cell = shape.currentMatrix[y][x];
            if (cell) {
                // Get the position on the grid
                var gridX = shape.x + x;
                var gridY = shape.y + y;
                // Count the non-empty cells below the roof
                var foundEmpty = false;
                while (gridY >= 0 && gridY < grid.length) {
                    var gridCell = grid[gridY][gridX];
                    if (gridCell.block) {
                        roofThickness++;
                    } else {
                        // Until the first empty, without it this is no roof
                        if (!foundEmpty) {
                            foundEmpty = true;
                            roofThicknessScore += roofThickness;
                        }
                        roofHeightScore++;
                    }
                    // Check next in this column
                    gridY++;
                }
                // Break to check the next column
                break;
            }
        }
    }
    roofThicknessScore = roofThicknessScore / maxRoofThickness;
    roofHeightScore = roofHeightScore / maxRoofHeight;
    // Adjacency score
    var adjacencyScore = 0;
    var maxAdjacency = 10;
    if (shape.y > -2) {
        for (var y = 0, lenY = shape.currentMatrix.length; y < lenY; y++) {
            var row = shape.currentMatrix[y];
            for (var x = 0, lenX = row.length; x < lenX; x++) {
                var cell = row[x];
                if (cell) {
                    // Check n, e, s and w grid cells
                    var baseGridY = shape.y + y;
                    var gridYN = baseGridY - 1;
                    var gridYS = baseGridY + 1;
                    var baseGridX = shape.x + x;
                    var gridXE = baseGridX + 1;
                    var gridXW = baseGridX - 1;
                    // North
                    if (gridYN >= 0 && baseGridX >= 0 && baseGridX < grid[0].length) {
                        var gridCell = grid[gridYN][baseGridX];
                        if (gridCell.block) {
                            // Check if it's not part of shape
                            var shapeYN = y - 1;
                            if (shapeYN < 0 || !shape.currentMatrix[shapeYN][x]) {
                                adjacencyScore += 1;
                            }
                        }
                    } else {
                        // Consider outside of borders as adjacent
                        adjacencyScore += 1;
                    }
                    // East
                    if (gridXE < grid[0].length && baseGridY >= 0 && baseGridY < grid.length) {
                        var gridCell = grid[baseGridY][gridXE];
                        if (gridCell.block) {
                            // Check if it's not part of shape
                            var shapeXE = x + 1;
                            if (shapeXE >= shape.currentMatrix.length || !shape.currentMatrix[y][shapeXE]) {
                                adjacencyScore += 1;
                            }
                        }
                    } else {
                        // Consider outside of borders as adjacent
                        adjacencyScore += 1;
                    }
                    // South
                    if (gridYS < grid.length && baseGridX >= 0 && baseGridX < grid[0].length) {
                        var gridCell = grid[gridYS][baseGridX];
                        if (gridCell.block) {
                            // Check if it's not part of shape
                            var shapeYS = y + 1;
                            if (shapeYS >= shape.currentMatrix.length || !shape.currentMatrix[shapeYS][x]) {
                                adjacencyScore += 1;
                            }
                        }
                    } else {
                        // Consider outside of borders as adjacent
                        adjacencyScore += 1;
                    }
                    // West
                    if (gridXW >= 0 && baseGridY >= 0 && baseGridY < grid.length) {
                        var gridCell = grid[baseGridY][gridXW];
                        if (gridCell.block) {
                            // Check if it's not part of shape
                            var shapeXW = x - 1;
                            if (shapeXW < 0 || !shape.currentMatrix[y][shapeXW]) {
                                adjacencyScore += 1;
                            }
                        }
                    } else {
                        // Consider outside of borders as adjacent
                        adjacencyScore += 1;
                    }
                }
            }
        }
    }
    adjacencyScore = adjacencyScore / maxAdjacency;
    // Well score
    var wellScore = 0;
    var maxWell = 19;
    for (var x = 0, lenX = grid[0].length; x < lenX; x++) {
        var score = 0;
        for (var y = 0, lenY = grid.length; y < lenY; y++) {
            var cell = grid[y][x];
            // We haven't reached the bottom yet
            if (!cell.block) {
                // Check its neighbors
                var left = x - 1;
                if (left < 0 || grid[y][left].block) {
                    var right = x + 1;
                    if (right >= grid[0].length || grid[y][right].block) {
                        // Both neighbors present, increase score
                        score++;
                        continue;
                    }
                }
                score = 0;
            }
            else {
                break;
            }
        }
        if (score > wellScore) {
            wellScore = score;
        }
    }
    wellScore = wellScore / maxWell;
    // Completed lines score - do this and potential score last
    var lineScore = 0;
    var maxLines = 4;
    for (var y = grid.length - 1; y >= 0; y--) {
        var row = grid[y];
        var fullLine = true;
        for (var x = 0, lenX = row.length; x < lenX; x++) {
            var cell = row[x];
            if (!cell.block) {
                fullLine = false;
                break;
            }
        }
        if (fullLine) {
            lineScore++;
            // Remove the line from the grid
            for (var y2 = y; y2 > 0; y2--) {
                var row2 = grid[y2];
                var above = grid[y2 - 1];
                for (var x2 = 0, lenX2 = row2.length; x2 < lenX2; x2++) {
                    row2[x2] = above[x2];
                }
            }
            // Empty the top line
            for (var x2 = 0, lenX2 = row2.length; x2 < lenX2; x2++) {
                grid[0][x2].block = false;
            }
        }
    }
    lineScore = lineScore / maxLines;
    // Potential score (WIP)
    var potentialScore = 0;
    var maxPotential = 1;
    if (calcPotential) {
        // There are currently 7 shapes
        for (var i = 0; i < 7; i++) {
            var checkShape = new Shape(i, 3, -2, true);
            var potential = this.getBestScore(checkShape, grid);
            potentialScore += potential;
        }
    }
    potentialScore = potentialScore / maxPotential;

    // For every type, apply its weights
    //return (Math.nonImaginaryPow(heightScore, this.weights.heightPowWeight) * this.weights.heightWeight)
    //    + (Math.nonImaginaryPow(roofThicknessScore, this.weights.roofThicknessPowWeight) * this.weights.roofThicknessWeight)
    //    + (Math.nonImaginaryPow(roofHeightScore, this.weights.roofHeightPowWeight) * this.weights.roofHeightWeight)
    //    + (Math.nonImaginaryPow(adjacencyScore, this.weights.adjacencyPowWeight) * this.weights.adjacencyWeight)
    //    + (Math.nonImaginaryPow(wellScore, this.weights.wellPowWeight) * this.weights.wellWeight)
    //    + (Math.nonImaginaryPow(lineScore, this.weights.linePowWeight) * this.weights.lineWeight);
    //    //+ (Math.nonImaginaryPow(potentialScore, this.weights.potentialPowWeight) * this.weights.potentialWeight);
    return (heightScore * this.weights.heightWeight)
        + (roofThicknessScore * this.weights.roofThicknessWeight)
        + (roofHeightScore * this.weights.roofHeightWeight)
        + (adjacencyScore * this.weights.adjacencyWeight)
        + (wellScore * this.weights.wellWeight)
        + (lineScore * this.weights.lineWeight)
        + (potentialScore * this.weights.potentialWeight);
};

DNA.prototype.getBestScore = function (shape, grid) {
    var bestScore = -Infinity;
    // Get a new shape
    var shapeDir = new Shape(shape.identifier, shape.x, shape.y, true);
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
                var score = this.calcShapeScore(shapeMove, gridCopy);
                if (score > bestScore) {
                    bestScore = score;
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
                var score = this.calcShapeScore(shapeMove, gridCopy);
                if (score > bestScore) {
                    bestScore = score;
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
    return bestScore;
};

DNA.prototype.calcFitness = function () {
    var returnVal = 0;
    if (this.reachedEnd) {
        returnVal = 1 + this.scored;
    } else {
        returnVal = this.scored * .95;
    }
    // Return squared
    return Math.pow(returnVal, 2);
};

DNA.prototype.calcDiversity = function (pool) {
    var totalDiff = 0;
    pool.map(function (dna) {
        for (var prop in this.weights) {
            if (dna.weights.hasOwnProperty(prop)) {
                var self = this.weights[prop];
                var other = dna.weights[prop];
                var diff = Math.abs(other - self);
                totalDiff += diff;
            }
        }
    }.bind(this));
    var returnVal = totalDiff / DNA.weightCount;
    return Math.pow(returnVal, 2);
};

// weights html for normal+pow weights
//DNA.prototype.getWeightsHtml = function () {
//    var result = "";
//    var odd = 0;
//    var divWhitespace = "<div class='whitespace'></div>";
//    var nWeight;
//    var pWeight;
//    for (var weight in this.weights) {
//        if (this.weights.hasOwnProperty(weight)) {
//            var value = this.weights[weight];
//            var clr = "#DFD;";
//            if (value < 0) {
//                clr = "#FDD;";
//            } else if (value == 0) {
//                clr = "#FFF;";
//            }
//            var html = "<span style='color: " + clr + "'>" + weight + ": " + value + "</span><br />";
//            if (odd % 2 == 1) {
//                pWeight = value;
//                var isNeg = nWeight < 0;
//                var combinedWeight = Math.abs(Math.nonImaginaryPow(nWeight, pWeight));
//                var scoreBar = 
//                    "<div class='bar' style='background-color: #" + (isNeg ? "C00" : "0C0") + ";'>" +
//                    "<div class='bar' style='float: left; background-color: #888; width: " + (isNeg ? (50 - combinedWeight * 50) : 50) + "%;'></div>" +
//                    "<div class='bar' style='float: right; background-color: #888; width: " + (!isNeg ? (50 - combinedWeight * 50) : 50) + "%;'></div>" +
//                    "</div>";
//                html += scoreBar;
//                html += divWhitespace;
//            } else {
//                nWeight = value;
//            }
//            odd++;
//            result += html;
//        }
//    }
//    return result;
//};

DNA.prototype.getWeightsHtml = function () {
    var result = "";
    var divWhitespace = "<div class='whitespace'></div>";
    for (var weight in this.weights) {
        if (this.weights.hasOwnProperty(weight)) {
            var value = this.weights[weight];
            var clr = "#DFD;";
            if (value < 0) {
                clr = "#FDD;";
            } else if (value == 0) {
                clr = "#FFF;";
            }
            var html = "<span style='color: " + clr + "'>" + weight + ": " + value + "</span><br />";
            var isNeg = value < 0;
            var scoreBar =
                "<div class='bar' style='background-color: #" + (isNeg ? "C00" : "0C0") + ";'>" +
                "<div class='bar' style='float: left; background-color: #888; width: " + (isNeg ? (50 + value * 50) : 50) + "%;'></div>" +
                "<div class='bar' style='float: right; background-color: #888; width: " + (!isNeg ? (50 - value * 50) : 50) + "%;'></div>" +
                "</div>";
            html += scoreBar;
            html += divWhitespace;
            result += html;
        }
    }
    return result;
};