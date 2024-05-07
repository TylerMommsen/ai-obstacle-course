const populationSize = 100;
let alive;
const mutationRate = 0.01;
const agents = [];
const obstacles = [];
let agentImage;
let goal;
let geneticAlgorithm;

function preload() {
	agentImage = loadImage("./assets/agent.png");
}

function setup() {
	createCanvas(1000, 1000);
	frameRate(60);

	// create obstacles
	createObstacles();

	// create goal
	goal = new Goal(width - 50, height / 2);

	// initialize the genetic algorithm
	geneticAlgorithm = new GeneticAlgorithm(populationSize, mutationRate);
	geneticAlgorithm.createPopulation();
	alive = populationSize;
}

function draw() {
	background(230);

	for (let i = 0; i < populationSize; i++) {
		let agent = geneticAlgorithm.population[i];
		agent.update();
		agent.show();
	}

	checkCollisions();
	displayObstacles();
	goal.show();

	// check if all the agents have died or found the goal and then start next generation
	if (geneticAlgorithm.allAgentsFinished()) {
		geneticAlgorithm.evolve();
		alive = populationSize;
	}

	fill(255);
	textSize(60);
	textStyle(BOLD);
	text("Generation: " + geneticAlgorithm.generation, 50, 100);
	text("Alive: " + alive, 50, 200);
}

function createObstacles() {
	roof = new Obstacle(0, 0, width, height / 2 - 100);
	floor = new Obstacle(0, height / 2 + 100, width, height / 2 - 100);
	wall1 = new Obstacle(150, height / 2 - 50, 50, 100); // initial close up wall

	wall2 = new Obstacle(300, height / 2 + 25, 50, 100); // bottom wall

	wall3 = new Obstacle(300, height / 2 - 100, 150, 70); // top wall

	wall4 = new Obstacle(400, height / 2 - 30, 50, 70); // connecting to top wall going down

	obstacles.push(roof, floor, wall1, wall2, wall3, wall4);
}

function displayObstacles() {
	for (let i = 0; i < obstacles.length; i++) {
		obstacles[i].show();
	}
}

function checkCollisions() {
	for (let i = 0; i < populationSize; i++) {
		let agent = geneticAlgorithm.population[i];

		if (agent.stopped) continue;

		// check collision against obstacles
		for (let j = 0; j < obstacles.length; j++) {
			if (obstacles[j].collides(agent)) {
				agent.kill();
				agent.stopped = true;
				alive--;
			}
		}

		// check if agent collides with the goal
		if (goal.collides(agent)) {
			agent.kill();
			agent.stopped = true;
			alive--;
		}

		// check if agent went beyond screen boundaries
		if (agent.outOfBounds()) {
			agent.kill();
			agent.stopped = true;
			alive--;
		}
	}
}
