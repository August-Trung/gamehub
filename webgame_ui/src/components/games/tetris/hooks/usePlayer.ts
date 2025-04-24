import { useState, useCallback } from "react";
import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINOS } from "../constants/constants";
import { PlayerType, Board, MoveType, TetrominoType } from "../types/types";
import { randomTetromino } from "./useTetris";

export const usePlayer = (
	nextPiece: TetrominoType,
	setNextPiece: React.Dispatch<React.SetStateAction<TetrominoType>>
) => {
	const [player, setPlayer] = useState<PlayerType>({
		pos: { x: 0, y: 0 },
		tetromino: [[0]],
		collided: false,
		tetrominoType: "0" as TetrominoType,
	});

	// Check for collisions
	const checkCollision = useCallback(
		(
			player: PlayerType,
			board: Board,
			{ x: moveX, y: moveY }: MoveType
		): boolean => {
			for (let y = 0; y < player.tetromino.length; y++) {
				for (let x = 0; x < player.tetromino[y].length; x++) {
					// Check that we're on a tetromino cell
					if (player.tetromino[y][x] !== 0) {
						const newX = player.pos.x + x + moveX;
						const newY = player.pos.y + y + moveY;

						// Check collision with walls or bottom
						if (
							newX < 0 ||
							newX >= BOARD_WIDTH ||
							newY >= BOARD_HEIGHT ||
							// Check collision with other pieces
							(newY >= 0 && board[newY][newX] !== 0)
						) {
							return true;
						}
					}
				}
			}
			return false;
		},
		[]
	);

	// Create a tetromino with the correct value
	const createTetromino = useCallback((type: TetrominoType) => {
		// Create a copy of the tetromino shape
		const tetrominoShape = TETROMINOS[type].shape.map((row) =>
			row.map((cell) => (cell === 0 ? 0 : TETROMINOS[type].value || cell))
		);

		return tetrominoShape;
	}, []);

	// Reset the player position
	const resetPlayer = useCallback(() => {
		const piece = nextPiece;
		setNextPiece(randomTetromino());

		setPlayer({
			pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
			tetromino: createTetromino(piece),
			collided: false,
			tetrominoType: piece,
		});
	}, [nextPiece, setNextPiece, createTetromino]);

	return { player, setPlayer, resetPlayer, checkCollision, createTetromino };
};
