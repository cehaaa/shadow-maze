import { Cell } from "./Cell";

export type Maze = Cell[][];
export type Wall = "up" | "right" | "bottom" | "left";

export interface Position {
	x: number;
	y: number;
}

export type WallMap = Record<Wall, Wall[]>;
export type DirectionMap = {
	[key in Wall]: { dx: number; dy: number };
};

export interface KeyMap {
	[key: string]: {
		dx: number;
		dy: number;
		wall: Wall;
	};
}
