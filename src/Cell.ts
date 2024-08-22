import { Direction } from "./types";

export class Cell {
	player: boolean;
	destination: boolean;
	visited: boolean;
	walls: Record<Direction, boolean>;
	hitWalls: Record<Direction, boolean>;
	mazeElement: HTMLDivElement;

	constructor() {
		this.player = false;
		this.destination = false;
		this.visited = false;
		this.walls = {
			up: true,
			right: true,
			down: true,
			left: true,
		};
		this.hitWalls = {
			up: false,
			right: false,
			down: false,
			left: false,
		};
		this.mazeElement = document.querySelector<HTMLDivElement>(".maze")!;
	}
	drawCell() {
		const cell = document.createElement("div");
		cell.classList.add("cell");

		const path = document.createElement("div");
		path.classList.add("path");

		if (this.player) path.classList.add("start");
		if (this.destination) path.classList.add("finish");

		if (this.hitWalls.up) cell.classList.add("wall-top-hit");
		if (this.hitWalls.down) cell.classList.add("wall-down-hit");
		if (this.hitWalls.right) cell.classList.add("wall-right-hit");
		if (this.hitWalls.left) cell.classList.add("wall-left-hit");

		if (this.walls.up) cell.classList.add("wall-top");
		if (this.walls.right) cell.classList.add("wall-right");
		if (this.walls.down) cell.classList.add("wall-down");
		if (this.walls.left) cell.classList.add("wall-left");

		cell.appendChild(path);

		this.mazeElement.appendChild(cell);
	}
}
