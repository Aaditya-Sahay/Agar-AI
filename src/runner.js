var m = 0.15

class Blob {
    constructor(x, y, dna) {
        this.acceleration = createVector(0, 0);
        this.velocity = createVector(0, -2);
        this.position = createVector(x, y);
        this.r = 8;
        this.maxspeed = 5;
        this.maxforce = 0.5;
        this.health = 1
        this.dna = []
        if (!dna) {
            this.dna[0] = random(-3, 3)
            this.dna[1] = random(-3, 3)
            this.dna[2] = random(0, 200)
            this.dna[3] = random(0, 200)
        } else {
            this.dna[0] = dna[0]
            this.dna[1] = dna[1]
            this.dna[2] = dna[2]
            this.dna[3] = dna[3]
            if (random(1) < m) {
                this.dna[0] += random(-1, 1)
            }
            if (random(1) < m) {
                this.dna[1] += random(-1, 1)
            }
            if (random(1) < m) {
                this.dna[2] += random(-10, 10)
            }
            if (random(1) < m) {
                this.dna[3] += random(-10, 10)
            }
        }
    }
    update() {
        this.health -= 0.005;
        this.r -= 0.005
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

        var foodSteer = this.eatFood(good, 0.3, this.dna[2]);
        var blobSteer = this.eatBlob(bad,  this.dna[3]);

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
                var sum = PI * this.r * this.r + PI * 16;
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

    eatBlob(blobs, perception) {
        var closest = null;
        var record = Infinity;
        for (let i = blobs.length - 1; i >= 0; i--) {
            var d = this.position.dist(blobs[i].position)
            if ( d < this.r + blobs[i].r) {
                if (this.r > blobs[i].r) {
                    var sum = PI * pow(this.r, 2) + PI * pow(blobs[i].r, 2);
                    this.r = sqrt(sum / PI);
                    blobs[i].health -= blobs[i].health
                }else if (d < perception && d < record) {
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
        return (this.health < 0)
    }

    cloning() {
        if (random(1) < 0.002) {
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
            line(0, 0, 0, -this.dna[0] * 10)
            ellipse(0, 0, this.dna[2] * 2, this.dna[2] * 2)
            stroke(255, 0, 0)
            line(0, 0, 0, -this.dna[1] * 10)
            ellipse(0, 0, this.dna[3] * 2, this.dna[3] * 2)
        }
        var gr = color(0, 255, 0)
        var rd = color(255, 0, 0)
        var actual = lerpColor(rd, gr, this.health)
        fill(actual);
        stroke(200);
        strokeWeight(1);
        beginShape();
        ellipse(0, 0, this.r, this.r)
        endShape(CLOSE);
        pop();
    }
}