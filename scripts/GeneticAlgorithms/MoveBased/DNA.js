var DNA = function (genes) {
    this.mutationProbability = .005;
    this.maxGenes = 40; // 20 move downs + 10 movements and rotations, so rather arbitrair
    this.genes = genes;
    this.favorLeft = Math.random() < .5;
    this.movesPlayed = 0;
    this.canMove = true;
    // If no genes are given, init empty
    if (!this.genes) {
        this.genes = [];
        for (var i = 0; i < this.maxGenes; i++) {
            var gene = Moves.getRandom(this.favorLeft);
            this.genes.push(gene);
            // No other moves shall follow a hard drop
            if (gene.move === Moves.hardDrop) {
                break;
            }
        }
    }
};

DNA.prototype.nextMove = function () {
    if (this.movesPlayed < this.genes.length) {
        var move = this.genes[this.movesPlayed];
        this.movesPlayed++;
        this.canMove = false;
        move.fire(function () {
            this.canMove = true;
        });
    }
};

DNA.prototype.calcDiversity = function (matingPool) {
    var geneDiffScore = 0;
    for (var i = matingPool.length - 1; i >= 0; i--) {
        var other = matingPool[i].dna;
        var geneLen = Math.max(this.genes.length, other.genes.length);
        var sameGenes = 0;
        for (var j = 0; j < geneLen; j++) {
            if (this.genes[j] == other.genes[j]) {
                sameGenes++;
            }
        }
        geneDiffScore += 1 - (sameGenes / geneLen);
    }
    return geneDiffScore / matingPool.length;
};

DNA.prototype.calcFitness = function (score, shape) {
    // Calc height fitness
    var maxHeight = grid.length;
    var heightFitness = shape.getFloorY() / maxHeight;
    // Square heightFitness
    heightFitness = heightFitness * heightFitness;
    // Calc score fitness
    var maxScore = 6000;
    var scoreFitness = score / maxScore;
    // Calc moves fitness
    var movesFitness = (this.maxGenes - 1 - this.genes.length) / this.maxGenes;
    // Calc roofing fitness
    var roofingFitness = shape.isRoofing() ? 0 : 1;
    //return (heightFitness * .1) + (scoreFitness * .3) + (movesFitness * .05);
    var fitness = (heightFitness * .6) + (scoreFitness * .3) + (movesFitness * .01) + (roofingFitness * .09);
    // Return the fitness squared
    return fitness * fitness;
};

DNA.prototype.crossover = function (dna) {
    // Exclude hardDrop from the first dna
    var smallestGenes = Math.min(this.genes.length, dna.genes.length);
    var rnd = parseInt(Math.random() * smallestGenes);
    var firstPart = this.genes.slice(0, rnd);
    var secondPart = dna.genes.slice(rnd);
    var newGenes = firstPart.concat(secondPart);
    return new DNA(newGenes);
};

DNA.prototype.mutate = function () {
    var mutated = false;
    for (var i = 0, len = this.genes.length; i < len; i++) {
        var rnd = Math.random();
        if (rnd <= this.mutationProbability) {
            mutated = true;
            // For now, we are excluding harddrops
            var newGene = Moves.getRandom(this.favorLeft);
            if (newGene == Moves.hardDrop) {
                // If the new gene is a harddrop, remove the gene instead
                this.genes.splice(i, 1);
            } else {
                this.genes[i] = newGene;
            }
        }
    }
    if (mutated) {
        shape.color.interpolate(new Color(0, 0, 0, 1), .5);
    }
};