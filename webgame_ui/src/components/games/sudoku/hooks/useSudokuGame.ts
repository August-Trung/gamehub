import { useState, useEffect, useCallback } from "react";
import { useSudokuSolver } from "./useSudokuSolver";

type CellData = {
	value: number | null;
	isFixed: boolean;
	isValid: boolean;
	notes: number[];
};

type Board = Array<Array<CellData>>;

export const useSudokuGame = () => {
	const [board, setBoard] = useState<Board>(createEmptyBoard());
	const [solution, setSolution] = useState<(number | null)[][]>([]);
	const [selectedCell, setSelectedCell] = useState<{
		row: number;
		col: number;
	} | null>(null);
	const [difficulty, setDifficulty] = useState<string>("medium");
	const [isGameCompleted, setIsGameCompleted] = useState<boolean>(false);
	const [isSolving, setIsSolving] = useState<boolean>(false);
	const [noteMode, setNoteMode] = useState<boolean>(false);
	const [mistakes, setMistakes] = useState<number>(0);

	const { generatePuzzle, solveSudoku, isValidMove } = useSudokuSolver();

	// Initialize a new game
	const initializeGame = useCallback(() => {
		let { puzzle, solution: generatedSolution } =
			generatePuzzle(difficulty);

		const newBoard = puzzle.map((row, rowIndex) =>
			row.map((value, colIndex) => ({
				value: value === 0 ? null : value,
				isFixed: value !== 0,
				isValid: true,
				notes: [],
			}))
		);

		setBoard(newBoard);
		setSolution(generatedSolution);
		setIsGameCompleted(false);
		setMistakes(0);
	}, [difficulty, generatePuzzle]);

	// Handle creating a new game
	const handleNewGame = useCallback(() => {
		initializeGame();
	}, [initializeGame]);

	// Initialize the game when component mounts or difficulty changes
	useEffect(() => {
		initializeGame();
	}, [difficulty, initializeGame]);

	// Check if the board is completed correctly
	const checkCompletion = useCallback(() => {
		// Check if all cells are filled
		const allFilled = board.every((row) =>
			row.every((cell) => cell.value !== null)
		);

		// Check if all cells are valid
		const allValid = board.every((row) =>
			row.every((cell) => cell.isValid)
		);

		setIsGameCompleted(allFilled && allValid);
		return allFilled && allValid;
	}, [board]);

	// Validate the entire board
	const validateBoard = useCallback(() => {
		const newBoard = board.map((row, rowIndex) =>
			row.map((cell, colIndex) => {
				if (cell.value === null) return cell;

				// Check if the value is valid for this position
				const isValid = isValidMove(
					board.map((r) => r.map((c) => c.value || 0)),
					rowIndex,
					colIndex,
					cell.value
				);

				return {
					...cell,
					isValid,
				};
			})
		);

		setBoard(newBoard);
		return newBoard;
	}, [board, isValidMove]);

	// Handle changing a cell's value
	const handleCellValueChange = useCallback(
		(row: number, col: number, value: number | null) => {
			if (!selectedCell) return;

			setBoard((prev) => {
				const newBoard = [...prev];
				const cell = newBoard[row][col];

				// Don't allow changing fixed cells
				if (cell.isFixed) return newBoard;

				if (noteMode && value !== null) {
					// Toggle note
					const noteIndex = cell.notes.indexOf(value);
					if (noteIndex === -1) {
						// Add note
						newBoard[row][col] = {
							...cell,
							notes: [...cell.notes, value].sort((a, b) => a - b),
						};
					} else {
						// Remove note
						const newNotes = [...cell.notes];
						newNotes.splice(noteIndex, 1);
						newBoard[row][col] = {
							...cell,
							notes: newNotes,
						};
					}
				} else {
					// Check if value is valid
					let isValid = true;
					if (value !== null) {
						isValid = isValidMove(
							newBoard.map((r) => r.map((c) => c.value || 0)),
							row,
							col,
							value
						);

						if (!isValid) {
							setMistakes((prev) => prev + 1);
						}
					}

					// Set the value
					newBoard[row][col] = {
						...cell,
						value,
						isValid,
						notes: [], // Clear notes when setting a value
					};
				}

				return newBoard;
			});

			// Check for game completion after a short delay
			setTimeout(() => {
				checkCompletion();
			}, 100);
		},
		[selectedCell, noteMode, isValidMove, checkCompletion]
	);

	// Handle solving the puzzle
	const handleSolve = useCallback(() => {
		setIsSolving(true);

		// Apply solution with a small delay to show the solving process
		setTimeout(() => {
			const newBoard = board.map((row, rowIndex) =>
				row.map((cell, colIndex) => ({
					...cell,
					value: solution[rowIndex][colIndex],
					isValid: true,
				}))
			);

			setBoard(newBoard);
			setIsGameCompleted(true);
			setIsSolving(false);
		}, 500);
	}, [board, solution]);

	// Handle clearing the board (reset to initial state)
	const handleClear = useCallback(() => {
		setBoard((prev) =>
			prev.map((row) =>
				row.map((cell) => ({
					...cell,
					value: cell.isFixed ? cell.value : null,
					isValid: true,
					notes: [],
				}))
			)
		);
		setIsGameCompleted(false);
		setMistakes(0);
	}, []);

	// Handle checking the current solution
	const handleCheckSolution = useCallback(() => {
		validateBoard();
	}, [validateBoard]);

	// Handle giving a hint
	const handleHint = useCallback(() => {
		if (!selectedCell || isGameCompleted) return;

		const { row, col } = selectedCell;
		const cell = board[row][col];

		// Don't give hints for fixed cells
		if (cell.isFixed || cell.value === solution[row][col]) return;

		const newBoard = [...board];
		newBoard[row][col] = {
			...cell,
			value: solution[row][col],
			isValid: true,
			notes: [],
		};

		setBoard(newBoard);
		checkCompletion();
	}, [selectedCell, board, solution, isGameCompleted, checkCompletion]);

	// Handle keyboard events for navigation and input
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (!selectedCell) return;

			const { row, col } = selectedCell;

			// Handle number keys (1-9)
			if (/^[1-9]$/.test(e.key)) {
				const value = parseInt(e.key, 10);
				handleCellValueChange(row, col, value);
				return;
			}

			// Handle navigation keys
			switch (e.key) {
				case "ArrowUp":
					if (row > 0) setSelectedCell({ row: row - 1, col });
					break;
				case "ArrowDown":
					if (row < 8) setSelectedCell({ row: row + 1, col });
					break;
				case "ArrowLeft":
					if (col > 0) setSelectedCell({ row, col: col - 1 });
					break;
				case "ArrowRight":
					if (col < 8) setSelectedCell({ row, col: col + 1 });
					break;
				case "Delete":
				case "Backspace":
					handleCellValueChange(row, col, null);
					break;
				case "n":
				case "N":
					setNoteMode((prev) => !prev);
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedCell, handleCellValueChange]);

	return {
		board,
		selectedCell,
		setSelectedCell,
		difficulty,
		setDifficulty,
		isGameCompleted,
		isSolving,
		noteMode,
		mistakes,
		handleCellValueChange,
		handleNewGame,
		handleSolve,
		handleClear,
		handleCheckSolution,
		handleHint,
	};
};

// Helper function to create an empty board
function createEmptyBoard(): Board {
	return Array(9)
		.fill(null)
		.map(() =>
			Array(9)
				.fill(null)
				.map(() => ({
					value: null,
					isFixed: false,
					isValid: true,
					notes: [],
				}))
		);
}
