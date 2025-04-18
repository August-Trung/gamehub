import { useCallback } from "react";

export const useWinCheck = () => {
	// Check if the current move results in a win
	const checkWin = useCallback(
		(
			board: string[][],
			row: number,
			col: number,
			player: string
		): { isWin: boolean; winLine: [number, number][] | null } => {
			const directions = [
				[0, 1], // horizontal →
				[1, 0], // vertical ↓
				[1, 1], // diagonal ↘
				[1, -1], // diagonal ↙
			];

			const boardSize = board.length;

			for (const [dx, dy] of directions) {
				// Count consecutive pieces in both directions
				let count = 1; // Start with 1 for the piece just placed
				const line: [number, number][] = [[row, col]];

				// Check in positive direction
				for (let i = 1; i < 5; i++) {
					const newRow = row + i * dx;
					const newCol = col + i * dy;

					if (
						newRow >= 0 &&
						newRow < boardSize &&
						newCol >= 0 &&
						newCol < boardSize &&
						board[newRow][newCol] === player
					) {
						count++;
						line.push([newRow, newCol]);
					} else {
						break;
					}
				}

				// Check in negative direction
				for (let i = 1; i < 5; i++) {
					const newRow = row - i * dx;
					const newCol = col - i * dy;

					if (
						newRow >= 0 &&
						newRow < boardSize &&
						newCol >= 0 &&
						newCol < boardSize &&
						board[newRow][newCol] === player
					) {
						count++;
						line.push([newRow, newCol]);
					} else {
						break;
					}
				}

				// If 5 or more in a row, it's a win
				if (count >= 5) {
					return { isWin: true, winLine: line };
				}
			}

			return { isWin: false, winLine: null };
		},
		[]
	);

	return { checkWin };
};
