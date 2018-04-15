var GeneticAlgorithm = function () {
    this.population = new Population();
    this.last5 = [];
    this.reset();
    game.resetCallbacks.push(function () {
        this.reset();
    }.bind(this));
    // Init the callbacks
    preNewShapeCallbacks.push(function (shape) {
        if (shape) {
            var scoreDiff = game.getScore() - this.prevScore;
            if (scoreDiff < 0)
                scoreDiff = 0;
            this.prevScore = game.getScore();
            // Calculate the fitness
            if (this.dnaScore) {
                if (scoreDiff) {
                    for (var i = 0; i < this.last5.length; i++) {
                        var dnaScore = this.last5[i];
                        dnaScore.fitness += 20 * (i + 1);
                    }
                }
                var diversity = this.population.calcDiversity(shape, this.dnaScore.dna);
                this.dnaScore.fitness = this.dnaScore.dna.calcFitness(scoreDiff, shape, diversity);
                this.last5.push(this.dnaScore);
                if (this.last5.length > 5) {
                    this.last5.splice(0, 1);
                }
            }
            // Update the average fitness of the shape
            var avgFitness = this.population.avgFitness(shape);
            stats.avgShapeFitness(shape, avgFitness);
            // Reset the dna
            this.dnaScore = false;
        }
    }.bind(this));
    postNewShapeCallbacks.push(function (shape) {
        this.dnaScore = this.population.nextDNAScore(shape);
    }.bind(this));
    setInterval(function () {
        if (unpaused) {
            if (this.dnaScore) {
                if (shape.y >= 0) {
                    this.dnaScore.dna.nextMove();
                }
            }
        }
    }.bind(this), updateFreq / 3);
};

GeneticAlgorithm.prototype.reset = function () {
    this.dnaScore = false;
    this.prevScore = 0;
};