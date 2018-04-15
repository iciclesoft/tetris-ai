var Population = function () {
    // For each pattern we have a mating pool
    this.patternPools = {};
    this.pf = new PatternFinder();
    this.maxPopulation = 100;
};

Population.prototype.nextDNAScore = function (shape) {
    var patternPools = this.validPatternPools();
    var matingPool;
    if (patternPools[shape.toString()]) {
        matingPool = patternPools[shape.toString()];
    } else {
        matingPool = [];
        patternPools[shape.toString()] = matingPool;
    }
    this.calcDiversity(matingPool);

    return this.naturalSelection(matingPool);
};

Population.prototype.validPatternPools = function () {
    var patterns = this.pf.getPatterns();
    var pattern = patterns[0];
    var name = "p" + this.pf.toString(pattern.bitmap);
    var pool = this.patternPools[name];
    if (pool) {
        //pool.push(this.patternPools[name]);
    } else {
        //pool = new PatternPool({});
        pool = {};
        this.patternPools[name] = pool;
    }
    return pool;
};

Population.prototype.calcDiversity = function (matingPool) {
    for (var i = matingPool.length - 1; i >= 0; i--) {
        var dnaScore = matingPool[i];
        dnaScore.diversity = dnaScore.dna.calcDiversity(matingPool);
    }
};

Population.prototype.naturalSelection = function (matingPool) {
    var dnaScore;
    if (matingPool.length < 100) {
        dnaScore = {
            dna: new DNA(),
            fitness: 0
        };
        matingPool.push(dnaScore);
    } else {
        var rnd1 = this.acceptedRandom(matingPool);
        //var rnd2 = this.acceptedRandom(matingPool);
        //var newDna = rnd1.dna.crossover(rnd2.dna);
        var newDna = rnd1.dna.crossover(rnd1.dna);
        newDna.mutate();
        dnaScore = {
            dna: newDna,
            fitness: 0
        }
        // Replace a random
        var rnd = parseInt(Math.random() * matingPool.length);
        matingPool[rnd] = dnaScore;
    }

    return dnaScore;
};

Population.prototype.acceptedRandom = function (matingPool) {
    var totalFitness = 0;
    var totalDiversity = 0;
    for (var i = matingPool.length - 1; i >= 0; i--) {
        var dna = matingPool[i];
        totalFitness += dna.fitness;
        totalDiversity += dna.diversity;
    }

    //if (matingPool.length > 100) {
    //    // Remove the first half from the array
    //    var removed = matingPool.splice(i, parseInt(matingPool.length * .5));
    //    for (var i = removed.length - 1; i >= 0; i--) {
    //        var dnaScore = removed[i];
    //        totalFitness -= dnaScore.fitness;
    //        totalDiversity -= dnaScore.diversity;
    //    }
    //}

    var rnd = Math.random() * (totalFitness + totalDiversity);
    var index = -1;
    var dna;
    while (rnd > 0) {
        index++;
        if (index >= matingPool.length) {
            index = 0;
        }
        dna = matingPool[index];
        rnd -= dna.fitness;
        rnd -= dna.diversity;
    }
    return dna;
};

Population.prototype.avgFitness = function (shape) {
    var total = 0;
    var count = 0;
    for (var prop in this.patternPools) {
        if (this.patternPools.hasOwnProperty(prop)) {
            var patternPool = this.patternPools[prop];
            var shapePool = patternPool[shape.toString()];
            if (shapePool) {
                for (var shaI = shapePool.length - 1; shaI >= 0; shaI--) {
                    var dnaScore = shapePool[shaI];
                    total += dnaScore.fitness;
                    count++;
                }
            }
        }
    }
    if (total && count) {
        return total / count;
    }
};

//var PatternPool = function (pool) {
//    this.pool = pool;
//};

//Population.prototype.naturalSelectedPatternPool = function (pools, shape) {
//    var fittest;
//    for (var i = 0, len = pools.length; i < len; i++) {
//        var shapePools = pools[i];
//        var matingPool;
//        if (shapePools[shape.toString()]) {
//            matingPool = shapePools[shape.toString()];
//        } else {
//            dna = new DNA();
//            shapePools[shape.toString()] = [];
//            shapePools[shape.toString()].push(dna);
//        }
//    }
//};