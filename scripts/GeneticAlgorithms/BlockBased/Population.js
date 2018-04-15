var Population = function () {
    this.index = -1;
    this.size = 40;
    this.generation = 0;
    this.population = [];
    this.prevScore = 0;
    this.mutationRate = .1;
    this.conversionPoint = .2;

    for (var i = 0; i < this.size; i++) {
        this.population.push(new DNA());
    }
};

Population.prototype.nextDna = function (dnaReachedEnd, dnaScored, maxBlocks) {
    if (this.index >= 0) {
        // Update the current dna
        var current = this.population[this.index];
        current.reachedEnd = dnaReachedEnd;
        current.scored = dnaScored;
    }
    // Get the next
    this.index++;
    if (this.index >= this.population.length) {
        this.index = 0;
        // Create a new generation
        this.generation++;
        var nextPopulation = [];
        for (var i = 0; i < this.size; i++) {
            var rndA = this.naturalSelection();
            var rndB = this.naturalSelection();
            var child = rndA.crossover(rndB, this.conversionPoint);
            child.mutate(this.mutationRate / DNA.weightCount);
            nextPopulation.push(child);
        }
        this.population = nextPopulation;
    }

    var curDna = this.population[this.index];
    $("#population").html("Generation: " + this.generation + "<br />" +
        "Current dna: " + this.index + "/" + this.population.length + "<br />" +
        (maxBlocks ? "Moves per dna: " + maxBlocks + "<br />" : "") +
        "<br /><br />" + curDna.getWeightsHtml());
    return curDna;
};

Population.prototype.naturalSelection = function () {
    // Calculate each score and save the max
    var maxFitness = 0;
    var maxDiversity = 0;
    for (var i = 0; i < this.size; i++) {
        var dna = this.population[i];
        dna.fitness = dna.calcFitness();
        if (dna.fitness > maxFitness)
            maxFitness = dna.fitness;
        dna.diversity = dna.calcDiversity(this.population);
        if (dna.diversity > maxDiversity)
            maxDiversity = dna.diversity;
    }
    // Normalize the scores
    var totalFitness = 0;
    var totalDiversity = 0;
    for (var i = 0; i < this.size; i++) {
        var dna = this.population[i];
        // Normalize fitness
        if (maxFitness) {
            dna.fitness = dna.fitness / maxFitness;
            // And square the fitness
            dna.fitness = Math.pow(dna.fitness, 2);
            totalFitness += dna.fitness;
            // Normalize diversity
            if (maxDiversity) {
                // Make diversity less important
                dna.diversity = (dna.diversity / maxDiversity) * .2;
            }
        }
        totalDiversity += dna.diversity;
    }
    // Get a random based on the height of both scores
    if (totalFitness || totalDiversity) {
        var rnd = Math.random() * (totalFitness + totalDiversity);
        var index = -1;
        var selected;
        while (rnd > 0) {
            index++;
            selected = this.population[index];
            rnd -= selected.fitness;
            rnd -= selected.diversity;
        }
    } else {
        // Introduce a new DNA if there is no fitness nor diversity
        selected = new DNA();
    }
    return selected;
};