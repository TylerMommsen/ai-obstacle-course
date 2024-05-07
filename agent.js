class Agent {
	constructor() {
		this.position = createVector(50, height / 2);
		this.velocity = createVector(0, 0);
		this.acceleration = createVector(0, 0);
		this.brain = new Brain(1000);
		this.width = 30;
		this.height = 30;
		this.angle = 0;
		this.targetAngle = 0;
		this.turnSpeed = 0.05;
		this.maxSpeed = 3;
		this.minSpeed = 0.5;
		this.speed = 1;
		this.fitness = 0;
		this.fitnessProbabilty = 0;
		this.stopped = false;
	}

	move() {
		if (this.brain.currentDirection < this.brain.directions.length) {
			const direction = this.brain.directions[this.brain.currentDirection];
			this.targetAngle = direction.angle;
			this.angle = this.lerpAngle(this.angle, this.targetAngle, this.turnSpeed);

			this.speed = direction.speed;
			this.speed = constrain(this.speed, this.minSpeed, this.maxSpeed);
			this.acceleration = p5.Vector.fromAngle(this.angle).mult(this.speed);

			this.brain.currentDirection++;
		} else {
			this.acceleration.set(0, 0);
		}

		this.velocity.add(this.acceleration);
		this.velocity.limit(this.maxSpeed);
		this.position.add(this.velocity);
	}

	show() {
		push();
		translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
		rotate(this.angle);
		imageMode(CENTER);
		image(agentImage, 0, 0, this.width, this.height);
		pop();
	}

	update() {
		this.move();
	}

	lerpAngle(current, target, amt) {
		let difference = target - current;
		difference = ((difference + PI) % TWO_PI) - PI;
		return current + difference * amt;
	}

	kill() {
		this.velocity.set(0, 0);
		this.acceleration.set(0, 0);
		this.brain.currentDirection = this.brain.size + 1;
	}

	outOfBounds() {
		// Get the center point of the agent's circular collision barrier
		let circleX = this.position.x + this.width / 2;
		let circleY = this.position.y + this.height / 2;
		let radius = 5;

		return (
			circleX - radius < 0 ||
			circleX + radius > width ||
			circleY - radius < 0 ||
			circleY + radius > height
		);
	}
}
