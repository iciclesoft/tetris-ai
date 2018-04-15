var Input = function () {
};

Input.prototype.initKeyboard = function () {
    // Init key-events
    $(document).keydown(function (e) {
        if (!unpaused) {
            return;
        }
        switch (e.keyCode) {
            case 37: // Left
                game.moveLeft();
                break;
            case 38: // Up
                game.hardDrop();
                break;
            case 39: // Right
                game.moveRight();
                break;
            case 40: // Down
                game.moveDown();
                break;
            case 65: // A
                game.turnCW();
                break;
            case 68: // D
                game.turnCCW();
                break;
        }
    });
    this.initialized();
};

Input.prototype.initAI = function () {
    new GeneticAlgorithm();
    this.initialized();
};

Input.prototype.initialized = function () {
    $("#btn-overlay").remove();
    unpaused = true;
};