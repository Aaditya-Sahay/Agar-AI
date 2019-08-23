let runners = [];
let food = [];
var population;
var popmax;
var debug,showHealth;
var resetBtn, cloneTime, foodtime, mutationRate, foodPerception, blobPerception, foodForce, blobForce, container, foodPop, foodChange, healthDecrease

function setup() {
    if (windowWidth < 1024){
    createCanvas(windowWidth, windowHeight);
    }
    else {
        createCanvas(displayWidth * 0.7, displayHeight);
    }
    initDOM()

    resetAll()
}

function initDOM() {
    var container = createDiv()
    container.class("container")

    resetBtn = createButton("Reset")
    resetBtn.mousePressed(resetAll)
    resetBtn.class("button is-danger")
    resetBtn.parent(container)

    mutationRate=new SliderDOM("Mutation Rate", 0,100,10,1,container)
    cloneTime = new SliderDOM("Reproduce Rate", 0,100,20,1,container)
    popmax = new SliderDOM("Maximum Population", 0,200,50,1,container)
    foodPop = new SliderDOM("Initial Food Population", 0,500,50,1,container)
    foodTime = new SliderDOM("Food Rate", 0,200,80,1,container)
    foodChange = new SliderDOM("Increase on Eating", -3,3,0.3,0.01,container)
    healthDecrease = new SliderDOM("Decrease per Frame", 0,2,0.005,0.01,container)
    foodPerception = new MinMax("Min, Max Food Perception","0",200,container)
    blobPerception = new MinMax("Min, Max Blob Perception","0",200,container)
    foodForce = new MinMax("Min, Max Food Force",-3,3,container)
    blobForce = new MinMax("Min, Max Blob Force",-3,3,container)

    var checkboxDiv = new DivDOM("card-content is-flex", container)
    debug = new CheckboxDOM("Show Debug", checkboxDiv)
    showHealth = new CheckboxDOM("Show Health",checkboxDiv)

    var Card = new DivDOM("card", container)
    var containerChild = new DivDOM("card-content", Card)

    allSettings = createP("Settings");
    allSettings.class("all");
    allSettings.parent(containerChild)
    var footer = createA(" https://github.com/Aaditya-Sahay/Agar-AI","Find Github repository here. Made by Aaditya Sahay")

    footer.parent(container)
    footer.class("has-text-centered help is-dark")
}

function resetAll() {
    for (let i = 0; i < foodPop.slider.value(); i++) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }
    for (let i = 0; i < popmax.slider.value(); i++) {
        var x = random(width)
        var y = random(height)
        runners[i] = new Blob(x, y);
    }
}

class MinMax{
    constructor(text, min, max,parent){
        this.text= createP(text),
        this.inputMin= createInput(min),
        this.inputMax= createInput(max)
        this.inputMin.class("input")
        this.inputMax.class("input")
        this.text.parent(parent)
        this.inputMin.parent(parent)
        this.inputMax.parent(parent)
    }
}

class SliderDOM {
    constructor(text, min,max,defaultVal, tick,parent) {
        this.text= createP(text);
        this.slider= createSlider(min, max, defaultVal, tick);
        this.text.parent(parent)
        this.slider.parent(parent)
    }
}

class CheckboxDOM {
    constructor(text, parent) {
        this.text= createP(text);
        this.checkbox= createCheckbox();
        this.checkbox.parent(parent)
        this.text.parent(parent)
        this.text.class("checkbox")
       
    }
}

function DivDOM(classVal, parent) {
        var temp = createDiv()
        temp.class(classVal)
        temp.parent(parent)
        return temp;
}

function draw() {
    let best = null, worldRecord = 0;
    background(255);
    if (random(1) < foodTime.slider.value() * 0.005) {
        var x = random(width)
        var y = random(height)
        food.push(createVector(x, y))
    }
    for (const i in food) {
        let Food = food[i]
        fill(0, 0, 255)
        noStroke()
        ellipse(Food.x, Food.y, 5, 5)
    }
    for (let i = runners.length - 1; i >= 0; i--) {
        runners[i].edge();
        runners[i].behaviours(food, runners)
        runners[i].update();
        runners[i].display();
        var newRunner = runners[i].cloning()
        if (newRunner != null) {
            runners.push(newRunner)
        }
        if (floor(runners[i].r) > worldRecord) {
            worldRecord = floor(runners[i].r);
            best = runners[i]
        }
        if (runners[i].isDead() == true) {
            let foodMass = floor(pow(runners[i].radius,2) /25)
            while(foodMass > 0) {
                food.push(createVector(runners[i].position.x + random(-20,20), runners[i].position.y + random(-20,20)))
                foodMass--
            }
            runners.splice(i, 1)
        }
    }
    var millisecond = millis()
    text('Milliseconds \nrunning: \n' + millisecond, 5, 40)
    if (best) {
        allSettings.html("Best Score: " + worldRecord + "<br> Mutation Rate: " + best.m + "<br> Food perception: " + best.dna[2] + "<br> Blob perception: " + best.dna[3] + "<br> Food Force Multiplier: " + best.dna[0] + "<br> Blob force Multiplier: " + best.dna[1])
    }
}
