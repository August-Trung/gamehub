import { useCallback } from "react";

export const useSudokuSolver = () => {
	// Check if a move is valid
	const isValidMove = useCallback(
		(board: number[][], row: number, col: number, num: number): boolean => {
			// Check row
			for (let x = 0; x < 9; x++) {
				if (board[row][x] === num && x !== col) {
					return false;
				}
			}

			// Check column
			for (let x = 0; x < 9; x++) {
				if (board[x][col] === num && x !== row) {
					return false;
				}
			}

			// Check 3x3 box
			const boxRow = Math.floor(row / 3) * 3;
			const boxCol = Math.floor(col / 3) * 3;

			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 3; j++) {
					if (
						board[boxRow + i][boxCol + j] === num &&
						(boxRow + i !== row || boxCol + j !== col)
					) {
						return false;
					}
				}
			}

			return true;
		},
		[]
	);

	// Find an empty cell
	const findEmptyCell = useCallback(
		(board: number[][]): [number, number] | null => {
			for (let row = 0; row < 9; row++) {
				for (let col = 0; col < 9; col++) {
					if (board[row][col] === 0) {
						return [row, col];
					}
				}
			}
			return null;
		},
		[]
	);

	// Solve the Sudoku puzzle using backtracking
	const solve = useCallback(
		(board: number[][]): boolean => {
			const emptyCell = findEmptyCell(board);

			// If no empty cell is found, the puzzle is solved
			if (!emptyCell) {
				return true;
			}

			const [row, col] = emptyCell;

			// Try numbers 1-9
			for (let num = 1; num <= 9; num++) {
				if (isValidMove(board, row, col, num)) {
					// Place the number
					board[row][col] = num;

					// Recursively solve the rest of the puzzle
					if (solve(board)) {
						return true;
					}

					// If placing this number doesn't lead to a solution, backtrack
					board[row][col] = 0;
				}
			}

			return false;
		},
		[findEmptyCell, isValidMove]
	);

	// Generate a random Sudoku puzzle
	const generatePuzzle = useCallback(
		(difficulty: string) => {
			// Create a solved board
			const board: number[][] = Array(9)
				.fill(0)
				.map(() => Array(9).fill(0));
			solve(board);

			// Create a copy of the solved board for the solution
			const solution: number[][] = board.map((row) => [...row]);

			// Remove numbers based on the difficulty
			const numberOfCellsToRemove =
				{
					easy: 30,
					medium: 40,
					hard: 50,
					expert: 60,
				}[difficulty] || 40;

			// Remove numbers
			let cellsRemoved = 0;
			while (cellsRemoved < numberOfCellsToRemove) {
				const row = Math.floor(Math.random() * 9);
				const col = Math.floor(Math.random() * 9);

				if (board[row][col] !== 0) {
					board[row][col] = 0;
					cellsRemoved++;
				}
			}

			return { puzzle: board, solution };
		},
		[solve]
	);

	// Solve a given Sudoku puzzle
	const solveSudoku = useCallback(
		(board: number[][]) => {
			const boardCopy: number[][] = board.map((row) => [...row]);
			solve(boardCopy);
			return boardCopy;
		},
		[solve]
	);

	return {
		isValidMove,
		generatePuzzle,
		solveSudoku,
	};
};
