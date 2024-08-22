import { Direction, Maze as MazeType } from "./types";
import { Cell } from "./Cell";
import { Utility } from "./Utility";
import { ROWS, COLUMNS, COUNTDOWN, DIRECTION_MAP } from "./constants";

interface Position {
	x: number;
	y: number;
}

interface GenerateMazeProps {
	x: number;
	y: number;
	maze: MazeType;
}

export class Maze {
	maze: MazeType;
	playerPos: Position;
	destinationPos: Position;
	height: number;
	width: number;
	directionMap: Record<Direction, { dx: number; dy: number }>;
	hearts: number;
	countdown: number;
	isMoveable: boolean;
	mazeElement: HTMLDivElement;

	constructor() {
		this.height = ROWS;
		this.width = COLUMNS;
		this.directionMap = DIRECTION_MAP;
		this.countdown = COUNTDOWN;
		this.maze = [];
		this.playerPos = { x: 0, y: 0 };
		this.destinationPos = { x: 0, y: 0 };
		this.isMoveable = false;
		this.mazeElement = document.querySelector<HTMLDivElement>(".maze")!;

		this.hearts = 3;

		window.addEventListener("keydown", this.movePlayer.bind(this));
	}
	generateMaze({ x, y, maze }: GenerateMazeProps) {
		maze[y][x].visited = true;

		const directions: Direction[] = ["up", "down", "left", "right"];
		Utility.shuffle(directions);

		for (const direction of directions) {
			let nx = x + this.directionMap[direction].dx;
			let ny = y + this.directionMap[direction].dy;

			const isInsideGridAndNotVisited =
				nx >= 0 &&
				nx < this.width &&
				ny >= 0 &&
				ny < this.height &&
				!maze[ny][nx].visited;

			if (isInsideGridAndNotVisited) {
				const current = maze[y][x];
				const neighbor = maze[ny][nx];

				if (direction === "up") {
					current.walls.up = false;
					neighbor.walls.down = false;
				} else if (direction === "right") {
					current.walls.right = false;
					neighbor.walls.left = false;
				} else if (direction === "down") {
					current.walls.down = false;
					neighbor.walls.up = false;
				} else if (direction === "left") {
					current.walls.left = false;
					neighbor.walls.right = false;
				}

				this.generateMaze({ x: nx, y: ny, maze });
			}
		}
	}
	createMaze() {
		const maze: MazeType = Array.from({ length: this.height }, () =>
			Array.from({ length: this.width }, () => new Cell())
		);

		this.generateMaze({
			x: 0,
			y: 0,
			maze,
		});
		return maze;
	}
	initializeRandomPlayerAndDestination() {
		let player = Utility.getRandomCoordinate(this.width, this.height);
		let destination = Utility.getRandomCoordinate(this.width, this.height);

		while (player.x === destination.x && player.y === destination.y) {
			destination = Utility.getRandomCoordinate(this.width, this.height);
		}

		this.maze[player.y][player.x].player = true;
		this.maze[destination.y][destination.x].destination = true;

		return {
			player,
			destination,
		};
	}
	checkIsWinningALifeGame() {
		return (
			this.playerPos.x === this.destinationPos.x &&
			this.playerPos.y === this.destinationPos.y
		);
	}
	checkIsGameOver() {
		this.hearts -= 1;
		return this.hearts === 0;
	}
	gameOver(isWin: boolean = false) {
		const txt = isWin ? "You Win!" : "Game over! Try again?";
		confirm(txt) && this.init();
	}
	movePlayer(event: KeyboardEvent) {
		if (!this.isMoveable) return;
		let { x, y } = this.playerPos;

		const { key } = event;
		const arrows = ["ArrowDown", "ArrowLeft", "ArrowRight", "ArrowUp"];
		if (!arrows.includes(key)) return;

		this.maze[y][x].player = false;

		if (key === "ArrowUp") {
			if (this.maze[y][x].walls.up && y !== 0) {
				this.maze[y][x].hitWalls.up = true;
				this.maze[y - 1][x].hitWalls.down = true;
				if (this.checkIsGameOver()) {
					this.gameOver();
					return;
				}
			} else y -= 1;
		} else if (key === "ArrowRight") {
			if (this.maze[y][x].walls.right && x !== this.width - 1) {
				this.maze[y][x].hitWalls.right = true;
				this.maze[y][x + 1].hitWalls.left = true;
				if (this.checkIsGameOver()) {
					this.gameOver();
					return;
				}
			} else x += 1;
		} else if (key === "ArrowDown") {
			if (this.maze[y][x].walls.down && y !== this.height - 1) {
				this.maze[y][x].hitWalls.down = true;
				this.maze[y + 1][x].hitWalls.up = true;
				if (this.checkIsGameOver()) {
					this.gameOver();
					return;
				}
			} else y += 1;
		} else if (key === "ArrowLeft") {
			if (this.maze[y][x].walls.left && x !== 0) {
				this.maze[y][x].hitWalls.left = true;
				this.maze[y][x - 1].hitWalls.right = true;
				if (this.checkIsGameOver()) {
					this.gameOver();
					return;
				}
			} else x -= 1;
		}

		if (x < 0) x = 0;
		if (x >= this.width) x = this.width - 1;
		if (y < 0) y = 0;
		if (y >= this.height) y = this.height - 1;

		this.playerPos = { x, y };
		this.maze[this.playerPos.y][this.playerPos.x].player = true;

		this.drawMaze();
		this.checkIsWinningALifeGame() && this.gameOver(true);
	}
	drawMaze() {
		document.querySelector(".maze")!.innerHTML = "";
		for (const row of this.maze) {
			for (const col of row) {
				col.drawCell();
			}
		}
	}
	resetState() {
		this.maze = [];
		this.playerPos = { x: 0, y: 0 };
		this.destinationPos = { x: 0, y: 0 };
		this.hearts = 3;
		this.isMoveable = false;
		this.mazeElement.classList.remove("hide");
	}
	init() {
		this.resetState();

		this.maze = this.createMaze();
		this.drawMaze();

		setTimeout(() => {
			this.mazeElement.classList.add("hide");
			this.isMoveable = true;

			const { player, destination } =
				this.initializeRandomPlayerAndDestination();

			this.playerPos = player;
			this.destinationPos = destination;
			this.drawMaze();
		}, this.countdown);
	}
}
