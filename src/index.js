let runners = [];
let food = [];
var population;
var popmax;
var debug;
var cloneTime, foodtime, mutationRate

function setup() {
    createCanvas(1024, 768);
    for (let i = 0; i < 100; i++) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }
    mutationRate = {
        slider: createSlider(),
        text: createP("Mutation Rate")
    }
    popmax = 50
    for (let i = 0; i < popmax; i++) {
        var x = random(width)
        var y = random(height)
        runners[i] = new Blob(x, y);
    }
    debug = {
        checkbox: createCheckbox(),
    }
}


function draw() {
    background(255);

    if (random(1) < 0.08) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }


    for (const i in food) {
        let Food = food[i]
        fill(0, 0, 255)
        noStroke()
        ellipse(Food.x, Food.y, 4, 4)
    }



    for (let i = runners.length - 1; i >= 0; i--) {
        runners[i].boundaries();
        runners[i].behaviours(food, runners)
        runners[i].update();
        runners[i].display();
        var newRunner = runners[i].cloning()
        if (newRunner != null) {
            runners.push(newRunner)
        }
        if (runners[i].isDead() == true) {
            food.push(createVector(runners[i].position.x, runners[i].position.y))
            runners.splice(i, 1)
        }
    }
    var millisecond = millis()
    text : text('Milliseconds \nrunning: \n' + millisecond, 5, 40)
}

