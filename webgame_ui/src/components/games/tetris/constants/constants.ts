export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 25;

// Define numbered values for each tetromino type
export const TETROMINO_TYPES = {
	EMPTY: 0,
	I: 1,
	J: 2,
	L: 3,
	O: 4,
	S: 5,
	T: 6,
	Z: 7,
};

// Define tetromino interface with value property
export interface TetrominoInfo {
	shape: number[][];
	color: string;
	value: number;
}

// Tetromino types and shapes
export const TETROMINOS: { [key: string]: TetrominoInfo } = {
	0: { shape: [[0]], color: "#111", value: TETROMINO_TYPES.EMPTY },
	I: {
		shape: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		color: "#00f0f0",
		value: TETROMINO_TYPES.I,
	},
	J: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1],
		],
		color: "#0000f0",
		value: TETROMINO_TYPES.J,
	},
	L: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 0],
		],
		color: "#f0a000",
		value: TETROMINO_TYPES.L,
	},
	O: {
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "#f0f000",
		value: TETROMINO_TYPES.O,
	},
	S: {
		shape: [
			[0, 0, 0],
			[0, 1, 1],
			[1, 1, 0],
		],
		color: "#00f000",
		value: TETROMINO_TYPES.S,
	},
	T: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
		],
		color: "#a000f0",
		value: TETROMINO_TYPES.T,
	},
	Z: {
		shape: [
			[0, 0, 0],
			[1, 1, 0],
			[0, 1, 1],
		],
		color: "#f00000",
		value: TETROMINO_TYPES.Z,
	},
};

// Color mapping for board
export const TETROMINO_COLORS = {
	[TETROMINO_TYPES.EMPTY]: "#111",
	[TETROMINO_TYPES.I]: "#00f0f0",
	[TETROMINO_TYPES.J]: "#0000f0",
	[TETROMINO_TYPES.L]: "#f0a000",
	[TETROMINO_TYPES.O]: "#f0f000",
	[TETROMINO_TYPES.S]: "#00f000",
	[TETROMINO_TYPES.T]: "#a000f0",
	[TETROMINO_TYPES.Z]: "#f00000",
};
