import { useState, useCallback } from "react";
import { createEmptyBoard } from "./useTetris";
import { Board, PlayerType } from "../types/types";

export const useBoard = (
	level: number,
	setScore: React.Dispatch<React.SetStateAction<number>>,
	setLines: React.Dispatch<React.SetStateAction<number>>,
	setLevel: React.Dispatch<React.SetStateAction<number>>
) => {
	const [board, setBoard] = useState<Board>(createEmptyBoard());

	// Update the board when a piece lands
	const updateBoard = useCallback(
		(prevBoard: Board, player: PlayerType): Board => {
			// Deep clone the board
			const newBoard: Board = prevBoard.map((row) => [...row]);

			// Add the tetromino to the board
			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						newBoard[y + player.pos.y][x + player.pos.x] = value;
					}
				});
			});

			// Check for completed lines
			let linesCleared = 0;
			const updatedBoard: Board = newBoard.reduce((acc: Board, row) => {
				if (row.every((cell) => cell !== 0)) {
					linesCleared += 1;
					acc.unshift(Array(newBoard[0].length).fill(0));
				} else {
					acc.push(row);
				}
				return acc;
			}, []);

			// Update score and level based on lines cleared
			if (linesCleared > 0) {
				const points = [0, 40, 100, 300, 1200][linesCleared] * level;
				setScore((prev) => prev + points);
				setLines((prev) => {
					const newLines = prev + linesCleared;
					const newLevel = Math.floor(newLines / 10) + 1;
					if (newLevel > level) {
						setLevel(newLevel);
					}
					return newLines;
				});
			}

			return updatedBoard;
		},
		[level, setScore, setLines, setLevel]
	);

	return { board, setBoard, updateBoard };
};
