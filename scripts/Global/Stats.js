var Stats = function () {
    this.startDateTime = new Date();
    this.endDateTime;
    this.pausedTime = 0;
    this.lastPauseStart;

    this.shapeCount = {};
    this.shapeFitness = {};
};

Stats.prototype.incrementShape = function (shape) {
    var shapeStr = shape.toString();
    if (this.shapeCount[shapeStr]) {
        this.shapeCount[shapeStr]++;
    } else {
        this.shapeCount[shapeStr] = 1;
    }
};

Stats.prototype.avgShapeFitness = function (shape, avg) {
    var shapeStr = shape.toString();
    this.shapeFitness[shapeStr] = avg;
};

Stats.prototype.shapeCountHtml = function () {
    var html = "";
    for (var prop in this.shapeCount) {
        if (this.shapeCount.hasOwnProperty(prop)) {
            var count = this.shapeCount[prop];
            var fitness = "";
            if (this.shapeFitness[prop]) {
                fitness = " <span style='color: #FAA;'>(" + Math.round(this.shapeFitness[prop] * 100) + "%)</span>";
            }
            html += Shape.ToHtml(prop) + ": " + count + fitness + "<br />";
        }
    }
    return html + "Lines cleared: " + game.getLinesCleared();
};

Stats.prototype.setPause = function (paused) {
    if (paused) {
        this.lastPauseStart = new Date();
    } else {
        var pausedTime = new Date() - this.lastPauseStart;
        this.pausedTime += pausedTime;
    }
};

Stats.prototype.getTotalTime = function () {
    if (!this.startDateTime) {
        return "00:00:00";
    }

    var diff;
    if (this.endDateTime) {
        diff = this.endDateTime - this.pausedTime - this.startDateTime;
    } else {
        var now = new Date();
        diff = now - this.pausedTime - this.startDateTime;
    }

    return (parseInt(diff / 1000) + "").toHHMMSS();
};