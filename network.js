class NeuralNetwork{
    constructor(neuronCounts) {
        this.levels=[];
        for (let i=0; i<neuronCounts.length-1; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs, network) {
        let outputs=Level.feedForward(
            givenInputs, network.levels[0]
        );

        for (let i=1; i<network.levels.length; i++) {
            outputs=Level.feedForward(
                outputs, network.levels[i]
            );
        }

        return outputs;
    }

    static mutate(network, amount=1) {
        network.levels.forEach(level => {
            for(let i=0; i<level.biases.length; i++) {
                level.biases[i]=lerp(
                    level.biases[i],
                    Math.random()*2-1,
                    amount
                )
            }
            for(let i=0; i<level.weights.length; i++) {
                for(let j=0; j<level.weights[i]; j++) {
                    level.weights[i][j] = lerp(
                        level.weights[i][j],
                        Math.random()*2-1,
                        amount
                    )
                }
            }

        })
    }
}

class TrainedNetwork extends NeuralNetwork {
    constructor (neuronCounts) {
        super(neuronCounts);
        this.levels=[];
        for (let i=1; i<neuronCounts.length; i++) {
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1],
                i
            ));
        }
    }
}

class Level {
    constructor(inputCount, outputCount, trained=0) {
        this.inputs = new Array(inputCount);
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount);

        this.weights=[];
        for (let i=0; i<inputCount; i++) {
            this.weights[i]=new Array(outputCount);
        }

        if (!trained) {
            Level.#randomize(this);
        }
        else if (trained === 1) {
            this.biases = [0.021224954713202307, 0.18809305329288695, 0.24633680968736468, 0.08452286358190084, -0.2609079472119468, -0.20004693568484333];
            this.weights = [
                [0.7767822096547938, -0.684543052431855, 0.3296764802646317, -0.12321401908061302, -0.4707535265828393, -0.4526788093704126], 
                [-0.7413274900284912, -0.7485429577164147, -0.2162584314275393, 0.9358784441897825, -0.7571815135320712, 0.5365882333750318], 
                [-0.07856948832608257, 0.2245464752274402, 0.7559466450992369, -0.41551894817047064, -0.814735712816598, -0.32178353177332486], 
                [-0.8263794563230902, 0.01457065452878581, -0.8489202217219836, -0.5599520999500869, 0.2945760625346847, -0.9830573501068662],
                [0.012188946889148511, -0.04238105452069707, -0.4806500138716481, -0.555306911457949, -0.04032134983836233, 0.44453978059745136]
            ];
        }
        else if (trained == 2) {
            this.biases = [-0.07603117382861158, -0.15742114700058799, -0.30299667477021663, 0.024341828823381928];
            this.weights = [
                [0.3010932567473845, 0.7656117478778901, 0.20542856794397757, 0.208901138079729],
                [0.10501827069315395, 0.8816914326423673, -0.6267751879656118, -0.9317667860117744],
                [0.22582977600506737, -0.45757631846104463, 0.2516432942226592, 0.7100797292966612],
                [-0.37503642853403507, -0.6056145062671909, -0.012893434743831644, -0.6255666280050676],
                [0.40918228573289417, -0.13009072390524024, -0.6046881884075725, -0.06881614500306199],
                [0.9670588359010166, -0.365237506316606, -0.4490010920562151, -0.3101050109009238]
            ];
        }
    }

    static #randomize(level) {
        for (let i=0; i<level.inputs.length; i++) {
            for (let j=0; j<level.outputs.length; j++) {
                level.weights[i][j] = Math.random()*2 - 1;
            }
        }

        for (let i=0; i<level.biases.length; i++) {
            level.biases[i] = Math.random()*2-1;
        }
    }

    static feedForward(givenInputs, level) {
        for (let i=0; i<level.inputs.length; i++) {
            level.inputs[i]=givenInputs[i];
        }

        for (let i=0; i<level.outputs.length; i++) {
            let sum=0; 
            for (let j=0; j<level.inputs.length; j++) {
                sum += level.inputs[j] * level.weights[j][i];
            }

            if (sum>level.biases[i]) {
                level.outputs[i] = 1;
            }
            else{
                level.outputs[i] = 0;
            }
        }

        return level.outputs;
    }
}