var Moves = function (desiredX, desiredDir) {
    this.desX = desiredX;
    this.desDir = desiredDir;
};

Moves.prototype.nextMove = function () {
    // Not ready to move? Await next move...
    if (shape) {
        var ready = shape.getFloorY() >= 1;
        if (ready) {
            var rotate = this.desDir != shape.dir;
            if (rotate) {
                var turnCW = (this.desDir - shape.dir > 2);
                if (turnCW) {
                    this.fire(Moves.turnCW);
                } else {
                    this.fire(Moves.turnCCW);
                }
            }
            var move = this.desX != shape.x;
            if (move) {
                var moveLeft = (this.desX - shape.x < 0);
                if (moveLeft) {
                    this.fire(Moves.moveLeft);
                } else {
                    this.fire(Moves.moveRight);
                }
            }
            // End with a harddrop
            if (!rotate && !move) {
                this.fire(Moves.hardDrop);
            }
        }
    }
};

Moves.prototype.fire = function (move) {
    switch (move) {
        case Moves.moveLeft:
            game.moveLeft();
            break;
        case Moves.moveRight:
            game.moveRight();
            break;
        case Moves.turnCW:
            game.turnCW();
            break;
        case Moves.turnCCW:
            game.turnCCW();
            break;
        case Moves.hardDrop:
            game.hardDrop();
            break;
    }
};

Moves.moveLeft = 0;
Moves.moveRight = 1;
Moves.turnCW = 2;
Moves.turnCCW = 3;
Moves.hardDrop = 4;