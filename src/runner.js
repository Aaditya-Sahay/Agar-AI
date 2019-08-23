class Blob {
    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 8;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.health = 1
        this.color = color(random(0, 255), random(0, 255), random(0, 255))
        this.dna = []
        this.m = mutationRate.slider.value() * 0.01
        this.cloneTime = cloneTime.slider.value() * 0.0001
        if (!dna) {
            this.dna[0] = random(Number(foodForce.inputMin.value()), foodForce.inputMax.value())
            this.dna[1] = random(Number(blobForce.inputMin.value()), blobForce.inputMax.value())
            this.dna[2] = random(Number(foodPerception.inputMin.value()), foodPerception.inputMax.value())
            this.dna[3] = random(Number(blobPerception.inputMin.value()), blobPerception.inputMax.value())
        } else {
            for (let i in dna) {
                this.dna[i] = dna[i];
                if (i > 1) {
                    if (random(1) < this.m) {
                        this.dna[i] += random(-10, 10)
                    }
                } else {
                    if (random(1) < this.m) {
                        this.dna[i] += random(-1, 1)
                    }
                }
            }
        }
    }
    update() {
        this.health -= healthDecrease.slider.value();
        this.r -= 0.04
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    applyForce(force) {
        force.mult(10 / this.r)
        force.limit(this.maxforce)
        this.acceleration.add(force);
    }

    edge() {
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
        var foodSteer = this.eatFood(good, foodChange.slider.value(), this.dna[2]);
        var blobSteer = this.eatBlob(bad, 0.5, this.dna[3]);
        foodSteer.mult(this.dna[0])
        blobSteer.mult(this.dna[1])

        this.applyForce(foodSteer);
        this.applyForce(blobSteer);
    }
    seek(target) {
        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxspeed);
        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);
        return steer
    }

    eatFood(list, change, perception) {
        var closestIndex = null;
        var record = Infinity;
        for (let i = list.length - 1; i >= 0; i--) {
            var d = this.position.dist(list[i])
            if (d < this.maxspeed) {
                list.splice(i, 1)
                this.health += change;
                var sum = PI * this.r * this.r + PI * change * 8 * 10;
                this.r = sqrt(sum / PI);
            } else if (d < perception && d < record) {
                record = d
                closestIndex = list[i]
            }

        }
        if (closestIndex != null) {
            return this.seek(closestIndex)
        }
        return createVector(0, 0)
    }

    eatBlob(blobs, change, perception) {
        var closest = null;
        var record = Infinity;
        for (let i = blobs.length - 1; i >= 0; i--) {
            var d = this.position.dist(blobs[i].position)
            if (d < this.r / 2 + this.maxspeed) {
                if (this.r > blobs[i].r) {
                    var sum = PI * pow(this.r, 2) + PI * pow(blobs[i].r, 2);
                    this.r = sqrt(sum / PI);
                    blobs[i].health -= blobs[i].health
                    this.health += change
                } else if (d < perception && d < record) {
                    record = d
                    closest = blobs[i].position
                }
            }
        }
        if (closest != null) {
            return this.seek(closest)
        }

        return createVector(0, 0)
    }
    isDead() {
        return (this.health <= 0 || this.radius <= 0)
    }

    cloning() {
        if (random(1) < this.cloneTime) {
            var x = random(width)
            var y = random(height)
            return new Blob(x, y, this.dna)
        } else {
            return null;
        }
    }
    display() {
        let theta = this.velocity.heading() + PI / 2;
        push();
        translate(this.position.x, this.position.y);

        rotate(theta);
        if (debug.checkbox.checked()) {
            stroke(0, 255, 0)
            noFill()
            strokeWeight(2);
            line(0, 0, 0, -this.dna[0] * 10 + this.r)
            strokeWeight(1);
            ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2)
            stroke(255, 0, 0)
            strokeWeight(2);
            line(0, 0, 0, -this.dna[1] * 10 + this.r)
            strokeWeight(1);
            ellipse(0, 0, this.dna[3] * 2, this.dna[3] * 2)
        }
        fill(this.color);
        stroke(200);
        strokeWeight(1);
        beginShape();
        ellipse(0, 0, this.r, this.r)
        if (showHealth.checkbox.checked()) {
            rotate(-theta)
            textAlign(CENTER)
            fill(0)
            text(floor(this.health * 10), 0, 0, 30, 30)
        }
        endShape(CLOSE);
        pop();
    }
}