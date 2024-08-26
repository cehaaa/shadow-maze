import { Wall } from "./types";

export class Cell {
	player: boolean;
	visited: boolean;
	destination: boolean;
	mazeElement: HTMLDivElement;
	walls: Record<Wall, boolean>;
	impactedWalls: Record<Wall, boolean>;

	constructor() {
		this.player = false;
		this.destination = false;
		this.visited = false;
		this.walls = {
			up: true,
			right: true,
			bottom: true,
			left: true,
		};
		this.impactedWalls = {
			up: false,
			right: false,
			bottom: false,
			left: false,
		};
		this.mazeElement = document.querySelector<HTMLDivElement>(".maze")!;
	}
	drawSpecialPath() {
		const specialPath = document.createElement("div");
		specialPath.classList.add("special-path");
		if (this.player) {
			specialPath.classList.add("player");
			return specialPath;
		}
		if (this.destination) {
			specialPath.classList.add("destination");
			return specialPath;
		}
	}
	drawCell() {
		const cell = document.createElement("div");
		cell.classList.add("cell");

		const path = document.createElement("div");
		path.classList.add("path");

		if (this.impactedWalls.up) cell.classList.add("top-wall-impacted");
		if (this.impactedWalls.right) cell.classList.add("right-wall-impacted");
		if (this.impactedWalls.bottom) cell.classList.add("bottom-wall-impacted");
		if (this.impactedWalls.left) cell.classList.add("left-wall-impacted");

		if (this.walls.up) cell.classList.add("wall-top");
		if (this.walls.right) cell.classList.add("wall-right");
		if (this.walls.bottom) cell.classList.add("wall-down");
		if (this.walls.left) cell.classList.add("wall-left");

		const specialPath = this.drawSpecialPath();
		if (specialPath) {
			cell.appendChild(specialPath);
		} else cell.appendChild(path);

		this.mazeElement.appendChild(cell);
	}
}
