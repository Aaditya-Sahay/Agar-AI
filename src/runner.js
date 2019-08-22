class Vehicle {
    constructor(x, y) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 6;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.health = 1
        this.dna = [random(-3, 3), random(-3, 3), random(10, 200), random(10, 200)];
        this.fitness = 0;
    }
    update() {
        this.fitness++
        this.health -= 0.005;
        this.velocity.add(this.acceleration);

        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);

        this.acceleration.mult(0);
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    boundaries() {
        let d = 35
        let desired = null;

        if (this.position.x < d) {
            desired = createVector(this.maxspeed, this.velocity.y);
        } else if (this.position.x > width - d) {
            desired = createVector(-this.maxspeed, this.velocity.y);
        }

        if (this.position.y < d) {
            desired = createVector(this.velocity.x, this.maxspeed);
        } else if (this.position.y > height - d) {
            desired = createVector(this.velocity.x, -this.maxspeed);
        }

        if (desired !== null) {
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired, this.velocity);
            steer.limit(this.maxforce);
            this.applyForce(steer);
        }
    }

    behaviours(good, bad) {

        var foodSteer = this.eatFood(good, 0.2, this.dna[2]);
        var poisonSteer = this.eatFood(bad, -0.5, this.dna[3]);

        foodSteer.mult(this.dna[0])
        poisonSteer.mult(this.dna[1])

        this.applyForce(foodSteer);
        this.applyForce(poisonSteer);
    }
    seek(target) {
        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxspeed);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer
    }
    createChild(best, m) {
        var x = random(width)
        var y = random(height)
        var child = new Vehicle(x, y)
        for (let i in child.dna) {
            child.dna[i] = best.dna[i]
        }
        child.mutate(m)
        return child;
    }
    mutate(m) {
        for (let i in this.dna) {
            if (random(1) < m) {
                if (i > 1) {
                    this.dna[i] = random(10, 200)
                }
                else {
                    this.dna[i] = random(-3, 3)
                }
            }
        }
    }
    eatFood(list, change, perception) {
        var closestIndex = -1;
        var record = Infinity;
        for (let i in list) {
            var d = this.position.dist(list[i])
            if (perception > d && d < record) {
                if (d < record) {
                    record = d
                    closestIndex = i
                }
            }
        }

        if (record < 5) {
            list.splice(closestIndex, 1)
            this.health += change;
            this.fitness += change * 100;
        } else if (closestIndex > -1) {
            return this.seek(list[closestIndex])
        }

        return createVector(0, 0)
    }


    isDead() {
        return (this.health < 0)
    }


    getFitness() {
        return (this.fitness)
    }


    showDebug() {
        let theta = this.velocity.heading() + PI / 2;
        translate(this.position.x, this.position.y);
        rotate(theta)
        stroke(0, 255, 0)
        noFill()
        line(0, 0, 0, -this.dna[0] * 10)
        ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2)
        stroke(255, 0, 0)
        line(0, 0, 0, -this.dna[1] * 10)
        ellipse(0, 0, this.dna[3] * 2, this.dna[3] * 2)

    }


    display() {
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + PI / 2;

        push();
        translate(this.position.x, this.position.y);
        rotate(theta);

        var gr = color(0, 255, 0)
        var rd = color(255, 0, 0)
        var actual = lerpColor(rd, gr, this.health)

        fill(actual);
        stroke(200);
        strokeWeight(1);
        beginShape();

        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();
    }
}