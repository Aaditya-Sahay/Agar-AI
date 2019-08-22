let runners = [];
let food = [];
let poison = [];
var population;
var popmax;
var mutation;

function setup() {
    createCanvas(1600, 900);
    for (let i = 0; i < 40; i++) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }
    for (let i = 0; i < 20; i++) {
        var x = random(width)
        var y = random(height)
        poison.push(createVector(x, y))
    }
    mutation = 0.1
    popmax = 5
    population = new Population(popmax, mutation)

}


function keyPressed() {
    if (keyCode === BACKSPACE) population.toggleDebug();
}

function draw() {
    background(255);

    if (food.length < 40) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }
    if (poison.length < 20) {
        var x = random(width)
        var y = random(height)
        poison.push(createVector(x, y))
    }

    for (const i in food) {
        let Food = food[i]
        fill(0, 255, 0)
        noStroke()
        ellipse(Food.x, Food.y, 10, 10)
    }
    for (const i in poison) {
        let Poison = poison[i]
        fill(255, 0, 0)
        noStroke()
        ellipse(Poison.x, Poison.y, 10, 10)
    }
    population.update()
    population.isDead()
    document.getElementsByTagName('h1')[0].innerHTML = "Best Score: " + this.population.record
}

