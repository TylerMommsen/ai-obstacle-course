class GeneticAlgorithm {
	constructor(populationSize, mutationRate) {
		this.populationSize = populationSize;
		this.mutationRate = mutationRate;
		this.population = [];
		this.generation = 1;
	}

	// create the initial population of agents
	createPopulation() {
		for (let i = 0; i < this.populationSize; i++) {
			this.population.push(new Agent());
		}
	}

	// calculate each agent's fitness (how close they made it to the goal)
	calculateFitness() {
		let fitnessSum = 0;
		const goalBonus = 1000;
		const maxDistance = dist(0, height / 2 - 100, width, height / 2 + 100);

		// set each agent's fitness value
		this.population.forEach((agent) => {
			const distanceToGoal = p5.Vector.dist(agent.position, goal.position);
			const normalizedDistance = distanceToGoal / maxDistance;

			let fitness = (1.0 - normalizedDistance) ** 2;

			if (goal.collides(agent)) {
				const remainingSteps = agent.brain.size - agent.brain.currentDirection;
				fitness += goalBonus + remainingSteps;
			}

			for (let i = 0; i < obstacles.length; i++) {
				if (obstacles[i].collides(agent)) {
					fitness *= 0.1;
				}
			}

			agent.fitness = fitness;
			fitnessSum += agent.fitness;
		});

		// set each agent's fitness probability between 0 and 1
		for (let i = 0; i < this.populationSize; i++) {
			const agent = this.population[i];
			agent.fitnessProbability = agent.fitness / fitnessSum;
		}
	}

	// pick agents that have a high fitness
	selection() {
		let index = 0;
		let r = random(1);

		while (r > 0) {
			r = r - this.population[index].fitnessProbability;
			index++;
		}
		index--;
		return this.population[index];
	}

	// copy the agent
	copy(parent) {
		const child = new Agent();
		child.brain.directions = parent.brain.directions.map((direction) => ({
			angle: direction.angle,
			speed: direction.speed,
		}));
		return child;
	}

	// mutate the directions of an agent with a certain probability
	mutate(child) {
		for (let i = 0; i < child.brain.directions.length; i++) {
			if (random(1) < this.mutationRate) {
				child.brain.directions[i] = { angle: random(TWO_PI), speed: random(0.5, 3) };
			}
		}
	}

	// create a new and 'better' generation of agents
	evolve() {
		const newPopulation = [];
		this.calculateFitness();

		for (let i = 0; i < this.population.length; i++) {
			const parent = this.selection();
			const child = this.copy(parent);
			this.mutate(child);
			newPopulation.push(child);
		}

		this.population = newPopulation;

		geneticAlgorithm.generation++;
	}

	// check if all agents have stopped moving (died or found the goal)
	allAgentsFinished() {
		return this.population.every((agent) => agent.brain.currentDirection >= agent.brain.size);
	}
}
