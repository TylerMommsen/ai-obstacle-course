const population = 50;
const agents = [];
const obstacles = [];
let agentImage;
let topObstacle;
let bottomObstacle;
let goal;

function preload() {
	agentImage = loadImage("./assets/agent.png");
}

function setup() {
	createCanvas(1000, 1000);
	frameRate(60);
	topObstacle = new Obstacle(0, 0, width, height / 2 - 100);
	bottomObstacle = new Obstacle(0, height / 2 + 100, width, height / 2 - 100);
	obstacles.push(topObstacle, bottomObstacle);
	goal = new Goal(width - 50, height / 2);

	for (let i = 0; i < population; i++) {
		agents.push(new Agent());
	}
}

function draw() {
	background(230);

	for (let i = 0; i < agents.length; i++) {
		agents[i].update();
		agents[i].show();
	}

	checkCollisions();
	displayObstacles();
	goal.show();
}

function displayObstacles() {
	topObstacle.show();
	bottomObstacle.show();
}

function checkCollisions() {
	for (let i = 0; i < agents.length; i++) {
		let agent = agents[i];

		// check collision against obstacles
		for (let j = 0; j < obstacles.length; j++) {
			if (obstacles[j].collides(agent)) {
				agent.kill();
			}
		}

		if (goal.collides(agent)) {
			agent.kill();
		}
	}
}
