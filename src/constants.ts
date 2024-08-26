import { KeyMap, DirectionMap, WallMap } from "./types";

export const ROWS = 7;
export const COLUMNS = 7;
export const COUNTDOWN = 30000;
export const DIRECTION_MAP: DirectionMap = {
	up: { dx: 0, dy: -1 },
	right: { dx: 1, dy: 0 },
	bottom: { dx: 0, dy: 1 },
	left: { dx: -1, dy: 0 },
};
export const WALL_MAP: WallMap = {
	up: ["up", "bottom"],
	right: ["right", "left"],
	bottom: ["bottom", "up"],
	left: ["left", "right"],
};
export const KEY_MAP: KeyMap = {
	ArrowUp: { ...DIRECTION_MAP.up, wall: "up" },
	ArrowRight: { ...DIRECTION_MAP.right, wall: "right" },
	ArrowDown: { ...DIRECTION_MAP.bottom, wall: "bottom" },
	ArrowLeft: { ...DIRECTION_MAP.left, wall: "left" },
};
