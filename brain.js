class Brain {
	constructor(size) {
		this.directions = [];
		this.currentDirection = 0;
		this.size = size;

		this.randomize();
	}

	randomize() {
		for (let i = 0; i < this.size; i++) {
			const randomAngle = random(TWO_PI);
			const randomSpeed = random(0.5, 3);
			this.directions.push({ angle: randomAngle, speed: randomSpeed });
		}
	}
}
