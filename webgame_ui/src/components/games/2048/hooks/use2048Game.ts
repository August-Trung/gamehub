import { useState, useEffect } from "react";

export interface TilePosition {
	row: number;
	col: number;
}

interface MovingTile {
	value: number;
	fromRow: number;
	fromCol: number;
	toRow: number;
	toCol: number;
}

interface MoveResult {
	board: number[][];
	moved: boolean;
	score: number;
}

interface TouchPosition {
	x: number;
	y: number;
}

export const use2048Game = () => {
	const [board, setBoard] = useState<number[][]>(() => {
		// Initialize board with 2 random tiles
		const emptyBoard: number[][] = Array(4)
			.fill(null)
			.map(() => Array(4).fill(0));
		const board1 = addRandomTileToBoard(emptyBoard);
		return addRandomTileToBoard(board1);
	});
	const [score, setScore] = useState<number>(0);
	const [gameOver, setGameOver] = useState<boolean>(false);
	const [won, setWon] = useState<boolean>(false);
	const [mergePositions, setMergePositions] = useState<TilePosition[]>([]);
	const [newTilePosition, setNewTilePosition] = useState<TilePosition | null>(
		null
	);
	const [movingTiles, setMovingTiles] = useState<Record<string, MovingTile>>(
		{}
	);
	const [touchStart, setTouchStart] = useState<TouchPosition | null>(null);
	const [touchEnd, setTouchEnd] = useState<TouchPosition | null>(null);

	function addRandomTileToBoard(board: number[][]): number[][] {
		const emptyTiles: TilePosition[] = [];

		// Find all empty tiles
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === 0) {
					emptyTiles.push({ row: i, col: j });
				}
			}
		}

		if (emptyTiles.length === 0) return board;

		// Randomly select an empty tile
		const { row, col } =
			emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

		// Set the value (90% chance of 2, 10% chance of 4)
		const newBoard = JSON.parse(JSON.stringify(board));
		newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

		return newBoard;
	}

	// Add a random tile and trigger animation
	function addRandomTile(board: number[][]): number[][] {
		const emptyTiles: TilePosition[] = [];

		// Find all empty tiles
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === 0) {
					emptyTiles.push({ row: i, col: j });
				}
			}
		}

		if (emptyTiles.length === 0) return board;

		// Randomly select an empty tile
		const { row, col } =
			emptyTiles[Math.floor(Math.random() * emptyTiles.length)];

		// Set the value (90% chance of 2, 10% chance of 4)
		const newBoard = JSON.parse(JSON.stringify(board));
		newBoard[row][col] = Math.random() < 0.9 ? 2 : 4;

		// Track the new tile position for animation
		setNewTilePosition({ row, col });

		// Reset the new tile position after animation
		setTimeout(() => {
			setNewTilePosition(null);
		}, 300);

		return newBoard;
	}

	function handleKeyDown(direction: "up" | "right" | "down" | "left"): void {
		if (gameOver) return;

		let newBoard = JSON.parse(JSON.stringify(board));
		let moved = false;
		let addedScore = 0;
		const newMergePositions: TilePosition[] = [];
		const newMovingTiles: Record<string, MovingTile> = {};

		// Record the starting positions of all non-zero tiles
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (newBoard[i][j] > 0) {
					newMovingTiles[`${i}-${j}`] = {
						value: newBoard[i][j],
						fromRow: i,
						fromCol: j,
						toRow: i,
						toCol: j,
					};
				}
			}
		}

		switch (direction) {
			case "up":
				for (let col = 0; col < 4; col++) {
					const result = moveColumn(
						newBoard,
						col,
						"up",
						newMergePositions,
						newMovingTiles
					);
					newBoard = result.board;
					moved = moved || result.moved;
					addedScore += result.score;
				}
				break;
			case "right":
				for (let row = 0; row < 4; row++) {
					const result = moveRow(
						newBoard,
						row,
						"right",
						newMergePositions,
						newMovingTiles
					);
					newBoard = result.board;
					moved = moved || result.moved;
					addedScore += result.score;
				}
				break;
			case "down":
				for (let col = 0; col < 4; col++) {
					const result = moveColumn(
						newBoard,
						col,
						"down",
						newMergePositions,
						newMovingTiles
					);
					newBoard = result.board;
					moved = moved || result.moved;
					addedScore += result.score;
				}
				break;
			case "left":
				for (let row = 0; row < 4; row++) {
					const result = moveRow(
						newBoard,
						row,
						"left",
						newMergePositions,
						newMovingTiles
					);
					newBoard = result.board;
					moved = moved || result.moved;
					addedScore += result.score;
				}
				break;
			default:
				return;
		}

		if (moved) {
			// First set the movement animation
			setMovingTiles(newMovingTiles);

			// After a delay, update the actual board and clear animations
			setTimeout(() => {
				const finalBoard = addRandomTile(newBoard);
				setBoard(finalBoard);
				setScore(score + addedScore);
				setMovingTiles({});

				// Set merge positions for animations
				setMergePositions(newMergePositions);

				// Clear merge animations after they play
				setTimeout(() => {
					setMergePositions([]);
				}, 300);

				// Check for win
				if (!won && hasValue(finalBoard, 2048)) {
					setWon(true);
				}

				// Check for game over
				if (!hasEmptyTile(finalBoard) && !canMove(finalBoard)) {
					setGameOver(true);
				}
			}, 150);
		}
	}

	function moveRow(
		board: number[][],
		rowIndex: number,
		direction: "left" | "right",
		mergePositions: TilePosition[],
		movingTiles: Record<string, MovingTile>
	): MoveResult {
		const row = [...board[rowIndex]];
		let moved = false;
		let score = 0;

		// Remove zeros and make a new array
		const values = row.filter((val) => val !== 0);
		const originalPositions: { value: number; col: number }[] = [];

		// Track original positions
		let colIndex = 0;
		for (let i = 0; i < 4; i++) {
			if (row[i] !== 0) {
				originalPositions.push({ value: row[i], col: i });
				colIndex++;
			}
		}

		if (direction === "left") {
			// Merge values moving left
			for (let i = 0; i < values.length - 1; i++) {
				if (values[i] === values[i + 1]) {
					values[i] *= 2;
					score += values[i];
					values[i + 1] = 0;
					moved = true;

					// Add to merge positions
					mergePositions.push({ row: rowIndex, col: i });
				}
			}
		} else {
			// Merge values moving right
			for (let i = values.length - 1; i > 0; i--) {
				if (values[i] === values[i - 1]) {
					values[i] *= 2;
					score += values[i];
					values[i - 1] = 0;
					moved = true;

					// Add to merge positions (adjusted for right alignment)
					const targetCol = 4 - values.length + i;
					mergePositions.push({ row: rowIndex, col: targetCol });
				}
			}
		}

		// Remove zeros again after merging
		const mergedValues = values.filter((val) => val !== 0);

		// Create new row with zeros on the appropriate side
		const newRow = Array(4).fill(0);

		if (direction === "left") {
			for (let i = 0; i < mergedValues.length; i++) {
				newRow[i] = mergedValues[i];
			}
		} else {
			for (let i = 0; i < mergedValues.length; i++) {
				newRow[4 - mergedValues.length + i] = mergedValues[i];
			}
		}

		// Check if anything moved and update animations
		let orgIndex = 0;
		for (let i = 0; i < 4; i++) {
			if (row[i] !== 0) {
				const origValue = row[i];
				let foundDestination = false;

				// Find where this value ended up
				for (let j = 0; j < 4; j++) {
					if (newRow[j] === origValue && !foundDestination) {
						// Update the moving tile info
						const key = `${rowIndex}-${i}`;
						if (movingTiles[key]) {
							movingTiles[key].toRow = rowIndex;
							movingTiles[key].toCol = j;
						}
						foundDestination = true;
					}
				}

				if (row[i] !== newRow[i]) {
					moved = true;
				}

				orgIndex++;
			}
		}

		// Update the board
		const newBoard = JSON.parse(JSON.stringify(board));
		newBoard[rowIndex] = newRow;

		return { board: newBoard, moved, score };
	}

	function moveColumn(
		board: number[][],
		colIndex: number,
		direction: "up" | "down",
		mergePositions: TilePosition[],
		movingTiles: Record<string, MovingTile>
	): MoveResult {
		// Extract column
		const column: number[] = [];
		for (let i = 0; i < 4; i++) {
			column.push(board[i][colIndex]);
		}

		let moved = false;
		let score = 0;

		// Remove zeros and make a new array
		const values = column.filter((val) => val !== 0);

		if (direction === "up") {
			// Merge values moving up
			for (let i = 0; i < values.length - 1; i++) {
				if (values[i] === values[i + 1]) {
					values[i] *= 2;
					score += values[i];
					values[i + 1] = 0;
					moved = true;

					// Add to merge positions
					mergePositions.push({ row: i, col: colIndex });
				}
			}
		} else {
			// Merge values moving down
			for (let i = values.length - 1; i > 0; i--) {
				if (values[i] === values[i - 1]) {
					values[i] *= 2;
					score += values[i];
					values[i - 1] = 0;
					moved = true;

					// Add to merge positions (adjusted for bottom alignment)
					const targetRow = 4 - values.length + i;
					mergePositions.push({ row: targetRow, col: colIndex });
				}
			}
		}

		// Remove zeros again after merging
		const mergedValues = values.filter((val) => val !== 0);

		// Create new column with zeros on the appropriate side
		const newColumn = Array(4).fill(0);

		if (direction === "up") {
			for (let i = 0; i < mergedValues.length; i++) {
				newColumn[i] = mergedValues[i];
			}
		} else {
			for (let i = 0; i < mergedValues.length; i++) {
				newColumn[4 - mergedValues.length + i] = mergedValues[i];
			}
		}

		// Track movement for animation
		for (let i = 0; i < 4; i++) {
			if (column[i] !== 0) {
				const origValue = column[i];
				let foundDestination = false;

				// Find where this value ended up
				for (let j = 0; j < 4; j++) {
					if (newColumn[j] === origValue && !foundDestination) {
						// Update the moving tile info
						const key = `${i}-${colIndex}`;
						if (movingTiles[key]) {
							movingTiles[key].toRow = j;
							movingTiles[key].toCol = colIndex;
						}
						foundDestination = true;
					}
				}
			}
		}

		// Check if anything moved
		for (let i = 0; i < 4; i++) {
			if (newColumn[i] !== column[i]) {
				moved = true;
			}
		}

		// Update the board
		const newBoard = JSON.parse(JSON.stringify(board));
		for (let i = 0; i < 4; i++) {
			newBoard[i][colIndex] = newColumn[i];
		}

		return { board: newBoard, moved, score };
	}

	function hasEmptyTile(board: number[][]): boolean {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === 0) return true;
			}
		}
		return false;
	}

	function hasValue(board: number[][], value: number): boolean {
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === value) return true;
			}
		}
		return false;
	}

	function canMove(board: number[][]): boolean {
		// Check for possible horizontal moves
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 3; j++) {
				if (board[i][j] === board[i][j + 1]) return true;
			}
		}

		// Check for possible vertical moves
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 4; j++) {
				if (board[i][j] === board[i + 1][j]) return true;
			}
		}

		return false;
	}

	function resetGame(): void {
		const emptyBoard: number[][] = Array(4)
			.fill(null)
			.map(() => Array(4).fill(0));
		const board1 = addRandomTileToBoard(emptyBoard);
		const board2 = addRandomTileToBoard(board1);

		setBoard(board2);
		setScore(0);
		setGameOver(false);
		setWon(false);
		setMergePositions([]);
		setNewTilePosition(null);
		setMovingTiles({});
	}

	const handleTouchStart = (e: React.TouchEvent): void => {
		setTouchEnd(null);
		setTouchStart({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	};

	const handleTouchMove = (e: React.TouchEvent): void => {
		setTouchEnd({
			x: e.targetTouches[0].clientX,
			y: e.targetTouches[0].clientY,
		});
	};

	const handleTouchEnd = (): void => {
		if (!touchStart || !touchEnd) return;

		const xDiff = touchStart.x - touchEnd.x;
		const yDiff = touchStart.y - touchEnd.y;

		// Determine horizontal or vertical swipe
		if (Math.abs(xDiff) > Math.abs(yDiff)) {
			// Horizontal swipe
			if (xDiff > 20) {
				handleKeyDown("left");
			} else if (xDiff < -20) {
				handleKeyDown("right");
			}
		} else {
			// Vertical swipe
			if (yDiff > 20) {
				handleKeyDown("up");
			} else if (yDiff < -20) {
				handleKeyDown("down");
			}
		}

		setTouchStart(null);
		setTouchEnd(null);
	};

	// Handle keyboard events
	useEffect(() => {
		const handleKeyboardEvent = (e: KeyboardEvent): void => {
			if (e.key === "ArrowUp") {
				handleKeyDown("up");
				e.preventDefault();
			} else if (e.key === "ArrowRight") {
				handleKeyDown("right");
				e.preventDefault();
			} else if (e.key === "ArrowDown") {
				handleKeyDown("down");
				e.preventDefault();
			} else if (e.key === "ArrowLeft") {
				handleKeyDown("left");
				e.preventDefault();
			}
		};

		window.addEventListener("keydown", handleKeyboardEvent);

		return () => {
			window.removeEventListener("keydown", handleKeyboardEvent);
		};
	}, [board, gameOver]);

	return {
		board,
		score,
		gameOver,
		won,
		mergePositions,
		newTilePosition,
		movingTiles,
		handleKeyDown,
		resetGame,
		handleTouchStart,
		handleTouchMove,
		handleTouchEnd,
	};
};
