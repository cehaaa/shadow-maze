import { Cell } from "./Cell";

export type Maze = Cell[][];
export type Direction = "up" | "right" | "down" | "left";

export interface GenerateMazeProps {
	x: number;
	y: number;
	maze: Maze;
	width: number;
	height: number;
}
