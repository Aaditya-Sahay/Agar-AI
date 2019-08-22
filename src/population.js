class Population {
    constructor(number, m) {
        this.runners = [];
        this.mutationRate = m;
        this.best;
        this.record = 0;
        this.alltime = 0;
        this.debug = false;
        for (let i = 0; i < number; i++) {
            var x = random(width)
            var y = random(height)
            this.runners[i] = new Vehicle(x, y);
        }
    }
    update() {
        let index = 0;
        for (let i = this.runners.length - 1; i >= 0; i--) {
            this.runners[i].behaviours(food, poison)
            this.runners[i].update();
            this.runners[i].display();
            this.runners[i].boundaries();
            if(this.debug){
                this.runners[i].showDebug()
            }
            if (this.runners[i].getFitness() > this.record) {
                this.record = this.runners[i].getFitness()
                index = i
            }
        }
        if (index) {
            this.best = this.runners[index]
        }
    }
    isDead() {
        for (let i = this.runners.length - 1; i >= 0; i--) {
            if (this.runners[i].isDead()) {
                let newChild = this.runners[i].createChild(this.best, this.mutationRate)
                this.runners[i] = newChild
            }
        }
    }
    toggleDebug(){
        this.debug = !this.debug
    }
}