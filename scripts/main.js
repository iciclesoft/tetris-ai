var cnv, ctx, width, height;
var grid = [[]];
var xCount = 10;
var yCount = 20;
var gridWH = 40;
var shapeX = parseInt((xCount - 2) * .5) - 1;
var shape;
var unpaused = false;
var canDraw = true;
var applyGravity = true;
var speed = 4;
var updateFreq = 1000 / speed;
var $score;
var game = new Game();
var stats = new Stats();
var preNewShapeCallbacks = [];
var postNewShapeCallbacks = [];

var init = function () {
    this.lastUpdated = Date.now();
    // Init the grid
    for (var y = 0; y < yCount; y++) {
        grid[y] = [];
        for (var x = 0; x < xCount; x++) {
            var gridX = x * gridWH;
            var gridY = y * gridWH;
            grid[y][x] = new GridBlock(gridX, gridY, gridWH, gridWH);
        }
    }
    // Init input
    var input = new Input();
    $("#keyboard").click(input.initKeyboard.bind(input));
    $("#ai").click(input.initAI.bind(input));
    // Start
    var prevShape;
    var play = function () {
        if (unpaused) {
            if (applyGravity) {
                if (shape) {
                    // Apply gravity
                    var now = Date.now();
                    var deltaTime = now - this.lastUpdated;
                    if (deltaTime >= updateFreq) {
                        if (!shape.moveDown(grid)) {
                            // Unable to move down
                            var fullBars = game.checkScored(grid);
                            if (fullBars) {
                                applyGravity = false;
                                game.removeBarsAnimation(grid, fullBars, function () {
                                    this.lastUpdated = now;
                                    applyGravity = true;
                                });
                            } else {
                                if (shape.x === shapeX && shape.y < 0) {
                                    // Game over
                                    game.endAnimation();
                                }
                            }
                            prevShape = shape;
                            shape = false;
                            this.lastUpdated = now;
                            return;
                        }
                        this.lastUpdated = now;
                    }
                    // Update the grid
                    shape.updateGrid(grid);
                } else {
                    // Init a new shape
                    firePreNewShapeCallbacks(prevShape);
                    shape = new Shape(Shape.getRandom(), shapeX, -2);
                    if (!shape) {
                        // Game over
                        game.endAnimation();
                    } else {
                        stats.incrementShape(shape);
                    }
                    firePostNewShapeCallbacks(shape);
                }
            }
            drawBackground();
            var $output = $("#output");
            $output.html("Current game time: " + stats.getTotalTime() + "<br />Stats:<br />" + stats.shapeCountHtml());
        }
        $score.html(game.getScore());
    };
    var nextFrame = function () {
        play();
        window.requestAnimationFrame(nextFrame);
    };
    window.requestAnimationFrame(nextFrame);
};

var drawBackground = function () {
    if (canDraw) {
        // Draw the background
        ctx.showStroke = false;
        ctx.showFill = true;
        ctx.fillColor(53);
        ctx.rect(0, 0, width, height);
        // Draw the grid
        for (var y = 0, lenY = grid.length; y < lenY; y++) {
            var gridY = grid[y];
            for (var x = 0, lenX = gridY.length; x < lenX; x++) {
                var gridBlock = gridY[x];
                gridBlock.show();
            }
        }
    }
};

var firePreNewShapeCallbacks = function (shape) {
    for (var i = 0, len = preNewShapeCallbacks.length; i < len; i++) {
        var func = preNewShapeCallbacks[i];
        func(shape);
    }
};

var firePostNewShapeCallbacks = function (shape) {
    for (var i = 0, len = postNewShapeCallbacks.length; i < len; i++) {
        var func = postNewShapeCallbacks[i];
        func(shape);
    }
};

$(document).ready(function () {
    cnv = $("#canvas")[0];
    ctx = cnv.getContext("2d");
    width = cnv.clientWidth;
    height = cnv.clientHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    $("#btn-pause").click(function () {
        unpaused = !unpaused;
        if (unpaused) {
            $(this).html("Pause");
            stats.setPause(false);
        } else {
            $(this).html("Unpause");
            stats.setPause(true);
        }
    });

    $score = $("#score");

    init();
});