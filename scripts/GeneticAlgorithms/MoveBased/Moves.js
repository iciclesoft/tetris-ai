var Moves = function (move) {
    this.move = move;
};

Moves.prototype.fire = function (callback) {
    switch (this.move) {
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
        case Moves.moveDown:
            game.moveDown();
            break;
        case Moves.await:
            setTimeout(function () {
                callback();
            }, updateFreq);
            break;
        case Moves.hardDrop:
            game.hardDrop();
            break;
    }

    if (this.move !== Moves.await) {
        callback();
    }
};

Moves.getRandom = function (favorLeft) {
    // Define probabilities
    var left = favorLeft ? .2 : .02;
    var right = left + (favorLeft ? .02 : .2);
    var cw = right + .1;
    var ccw = cw + .1;
    var down = ccw + .2;
    var await = down + .2;
    var drop = await + .05;
    var rnd = Math.random() * drop;
    var move = 0;
    if (rnd < left) {
        move = Moves.moveLeft;
    }
    else if (rnd < right) {
        move = Moves.moveRight;
    }
    else if (rnd < cw) {
        move = Moves.turnCW;
    }
    else if (rnd < ccw) {
        move = Moves.turnCCW;
    }
    else if (rnd < down) {
        move = Moves.moveDown;
    }
    else if (rnd < await) {
        move = Moves.await;
    }
    else {
        move = Moves.hardDrop;
    }
    return new Moves(move);
};

Moves.moveLeft = 0;
Moves.moveRight = 1;
Moves.turnCW = 2;
Moves.turnCCW = 3;
Moves.moveDown = 4;
Moves.await = 5;
Moves.hardDrop = 6;