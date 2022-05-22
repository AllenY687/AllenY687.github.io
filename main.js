const carCanvas = document.getElementById("carCanvas");
carCanvas.width = 200;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 300;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road= new Road(carCanvas.width/2, carCanvas.width*0.9);

N=20;
const cars = generateCars(N);

let bestCar=cars[0];
if(localStorage.getItem("bestBrain")) {
    for (let i=0; i<cars.length;i++) {
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        
            if (i!=0) {
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

// trained brain hardcoding
var text = '{"levels":[{"inputs":[0.5150000203505969,0.10383689106705196,0,0,0],"outputs":[1,0,0,0,0,1],"biases":[0.021224954713202307,0.18809305329288695,0.24633680968736468,0.08452286358190084,-0.2609079472119468,-0.20004693568484333],"weights":[[0.7767822096547938,-0.684543052431855,0.3296764802646317,-0.12321401908061302,-0.4707535265828393,-0.4526788093704126],[-0.7413274900284912,-0.7485429577164147,-0.2162584314275393,0.9358784441897825,-0.7571815135320712,0.5365882333750318],[-0.07856948832608257,0.2245464752274402,0.7559466450992369,-0.41551894817047064,-0.814735712816598,-0.32178353177332486],[-0.8263794563230902,0.01457065452878581,-0.8489202217219836,-0.5599520999500869,0.2945760625346847,-0.9830573501068662],[0.012188946889148511,-0.04238105452069707,-0.4806500138716481,-0.555306911457949,-0.04032134983836233,0.44453978059745136]]},{"inputs":[1,0,0,0,0,1],"outputs":[1,1,1,0],"biases":[-0.07603117382861158,-0.15742114700058799,-0.30299667477021663,0.024341828823381928],"weights":[[0.3010932567473845,0.7656117478778901,0.20542856794397757,0.208901138079729],[0.10501827069315395,0.8816914326423673,-0.6267751879656118,-0.9317667860117744],[0.22582977600506737,-0.45757631846104463,0.2516432942226592,0.7100797292966612],[-0.37503642853403507,-0.6056145062671909,-0.012893434743831644,-0.6255666280050676],[0.40918228573289417,-0.13009072390524024,-0.6046881884075725,-0.06881614500306199],[0.9670588359010166,-0.365237506316606,-0.4490010920562151,-0.3101050109009238]]}]}'
cars[0].brain = JSON.parse(text);




const traffic=[
    new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2, getRandomColor()),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2, getRandomColor())
];


animate();

function save() {
    localStorage.setItem("bestBrain",
        JSON.stringify(bestCar.brain)
    );

}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N) {
    const cars=[];
    for(let i=1;i<=N; i++) {
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time) {
    for(let i=0; i<traffic.length; i++) {
        traffic[i].update(road.borders, []);
    }

    for(let i=0; i<cars.length; i++) {
        cars[i].update(road.borders, traffic);
    }

    bestCar=cars.find(
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
        ));
    

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++) {
        traffic[i].draw(carCtx);
    }

    carCtx.globalAlpha=0.2;
    for(let i=1; i<cars.length; i++) {
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx, true);
    
    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);
    requestAnimationFrame(animate);
}
