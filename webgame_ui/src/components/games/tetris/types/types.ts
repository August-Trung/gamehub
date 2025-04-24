import { TETROMINOS } from "../constants/constants";

export type TetrominoType = keyof typeof TETROMINOS;
export type Board = number[][];
export type Tetromino = number[][];

export interface PlayerType {
	pos: { x: number; y: number };
	tetromino: Tetromino;
	collided: boolean;
	tetrominoType: TetrominoType;
}

export interface MoveType {
	x: number;
	y: number;
}
