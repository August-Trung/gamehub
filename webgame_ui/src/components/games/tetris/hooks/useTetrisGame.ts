// hooks/useTetrisGame.ts
import { useState, useEffect, useCallback } from "react";

// Board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Cell types
export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type BoardType = CellType[][];

// Tetromino types
export type TetrominoType = 1 | 2 | 3 | 4 | 5 | 6 | 7;

// Tetromino shapes and properties
interface Tetromino {
	shape: number[][];
	color: string;
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
	1: {
		// I
		shape: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		color: "cyan",
	},
	2: {
		// J
		shape: [
			[0, 0, 0],
			[2, 2, 2],
			[0, 0, 2],
		],
		color: "blue",
	},
	3: {
		// L
		shape: [
			[0, 0, 0],
			[3, 3, 3],
			[3, 0, 0],
		],
		color: "orange",
	},
	4: {
		// O
		shape: [
			[4, 4],
			[4, 4],
		],
		color: "yellow",
	},
	5: {
		// S
		shape: [
			[0, 0, 0],
			[0, 5, 5],
			[5, 5, 0],
		],
		color: "green",
	},
	6: {
		// T
		shape: [
			[0, 0, 0],
			[6, 6, 6],
			[0, 6, 0],
		],
		color: "purple",
	},
	7: {
		// Z
		shape: [
			[0, 0, 0],
			[7, 7, 0],
			[0, 7, 7],
		],
		color: "red",
	},
};

// Points for completed lines
const POINTS = {
	SINGLE: 100,
	DOUBLE: 300,
	TRIPLE: 500,
	TETRIS: 800,
	SOFT_DROP: 1,
	HARD_DROP: 2,
};

// Initial state
const createEmptyBoard = (): BoardType =>
	Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0));

// Random tetromino generator
const randomTetromino = (): TetrominoType => {
	const tetrominoTypes = [1, 2, 3, 4, 5, 6, 7] as TetrominoType[];
	return tetrominoTypes[Math.floor(Math.random() * tetrominoTypes.length)];
};

export const useTetrisGame = () => {
	const [board, setBoard] = useState<BoardType>(createEmptyBoard());
	const [currentPiece, setCurrentPiece] = useState<TetrominoType | null>(
		null
	);
	const [nextPiece, setNextPiece] =
		useState<TetrominoType>(randomTetromino());
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [score, setScore] = useState(0);
	const [lines, setLines] = useState(0);
	const [level, setLevel] = useState(1);
	const [gameOver, setGameOver] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [dropTime, setDropTime] = useState<number | null>(null);
	const [rotation, setRotation] = useState(0);

	// Calculate drop speed based on level
	const speed = 1000 / (level + 1) + 200;

	// Generate a new tetromino
	const generateNewPiece = useCallback(() => {
		const piece = nextPiece;
		const newNextPiece = randomTetromino();
		setCurrentPiece(piece);
		setNextPiece(newNextPiece);

		// Start position (centered on top)
		const pieceWidth = TETROMINOS[piece].shape[0].length;
		const newX = Math.floor((BOARD_WIDTH - pieceWidth) / 2);
		setPosition({ x: newX, y: 0 });
		setRotation(0);

		// Check for game over
		if (!isValidMove(0, 0, TETROMINOS[piece].shape, piece)) {
			setGameOver(true);
			setDropTime(null);
		}
	}, [nextPiece]);

	// Check if a move is valid
	const isValidMove = useCallback(
		(
			offsetX: number,
			offsetY: number,
			shape: number[][],
			piece: TetrominoType
		): boolean => {
			for (let y = 0; y < shape.length; y++) {
				for (let x = 0; x < shape[y].length; x++) {
					if (shape[y][x] !== 0) {
						const newX = position.x + x + offsetX;
						const newY = position.y + y + offsetY;

						// Check boundaries
						if (
							newX < 0 ||
							newX >= BOARD_WIDTH ||
							newY >= BOARD_HEIGHT ||
							// Check collision with existing pieces on the board
							(newY >= 0 && board[newY][newX] !== 0)
						) {
							return false;
						}
					}
				}
			}

			return true;
		},
		[position, board]
	);

	// Rotate the current piece
	const rotatePiece = useCallback((matrix: number[][]): number[][] => {
		// Create a new rotated matrix
		const rotatedMatrix = matrix
			.map((_, index) => matrix.map((col) => col[index]))
			.map((row) => row.reverse());

		return rotatedMatrix;
	}, []);

	// Update the board with the current piece
	const updateBoard = useCallback((): void => {
		if (!currentPiece) return;

		// Create a new board from the current state
		const newBoard = board.map((row) => [...row]);

		const shape = TETROMINOS[currentPiece].shape;

		// Add the current piece to the board
		for (let y = 0; y < shape.length; y++) {
			for (let x = 0; x < shape[y].length; x++) {
				if (shape[y][x] !== 0) {
					const boardY = position.y + y;
					const boardX = position.x + x;

					// Only update cells that are on the board
					if (
						boardY >= 0 &&
						boardY < BOARD_HEIGHT &&
						boardX >= 0 &&
						boardX < BOARD_WIDTH
					) {
						newBoard[boardY][boardX] = currentPiece;
					}
				}
			}
		}

		setBoard(newBoard);
	}, [board, currentPiece, position]);

	// Check for completed lines and update score
	const checkLines = useCallback((): void => {
		let linesCleared = 0;

		const newBoard = board.filter((row) => {
			const isLineFull = row.every((cell) => cell !== 0);
			if (isLineFull) {
				linesCleared++;
				return false;
			}
			return true;
		});

		// Add empty lines at the top
		while (newBoard.length < BOARD_HEIGHT) {
			newBoard.unshift(Array(BOARD_WIDTH).fill(0));
		}

		if (linesCleared > 0) {
			// Update score based on number of lines cleared
			let linePoints;
			switch (linesCleared) {
				case 1:
					linePoints = POINTS.SINGLE;
					break;
				case 2:
					linePoints = POINTS.DOUBLE;
					break;
				case 3:
					linePoints = POINTS.TRIPLE;
					break;
				case 4:
					linePoints = POINTS.TETRIS;
					break;
				default:
					linePoints = 0;
			}

			const newScore = score + linePoints * level;
			const newLines = lines + linesCleared;
			const newLevel = Math.floor(newLines / 10) + 1;

			setScore(newScore);
			setLines(newLines);
			setLevel(newLevel);
			setBoard(newBoard);
		}
	}, [board, score, lines, level]);

	// Move down logic
	const moveDown = useCallback((): void => {
		if (!currentPiece || gameOver || isPaused) return;

		if (isValidMove(0, 1, TETROMINOS[currentPiece].shape, currentPiece)) {
			setPosition((prev) => ({ ...prev, y: prev.y + 1 }));
		} else {
			// Piece has landed
			updateBoard();
			checkLines();
			generateNewPiece();
		}
	}, [
		currentPiece,
		gameOver,
		isPaused,
		isValidMove,
		updateBoard,
		checkLines,
		generateNewPiece,
	]);

	// Move left logic
	const moveLeft = useCallback((): void => {
		if (!currentPiece || gameOver || isPaused) return;

		if (isValidMove(-1, 0, TETROMINOS[currentPiece].shape, currentPiece)) {
			setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
		}
	}, [currentPiece, gameOver, isPaused, isValidMove]);

	// Move right logic
	const moveRight = useCallback((): void => {
		if (!currentPiece || gameOver || isPaused) return;

		if (isValidMove(1, 0, TETROMINOS[currentPiece].shape, currentPiece)) {
			setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
		}
	}, [currentPiece, gameOver, isPaused, isValidMove]);

	// Rotate logic
	const rotate = useCallback((): void => {
		if (!currentPiece || gameOver || isPaused) return;

		const rotatedShape = rotatePiece(TETROMINOS[currentPiece].shape);

		// Try rotation, if not possible at current position, try shifting left or right
		if (isValidMove(0, 0, rotatedShape, currentPiece)) {
			// Standard rotation
			setRotation((prev) => (prev + 1) % 4);
			TETROMINOS[currentPiece].shape = rotatedShape;
		} else if (isValidMove(1, 0, rotatedShape, currentPiece)) {
			// Try shifting right
			setPosition((prev) => ({ ...prev, x: prev.x + 1 }));
			setRotation((prev) => (prev + 1) % 4);
			TETROMINOS[currentPiece].shape = rotatedShape;
		} else if (isValidMove(-1, 0, rotatedShape, currentPiece)) {
			// Try shifting left
			setPosition((prev) => ({ ...prev, x: prev.x - 1 }));
			setRotation((prev) => (prev + 1) % 4);
			TETROMINOS[currentPiece].shape = rotatedShape;
		}
	}, [currentPiece, gameOver, isPaused, isValidMove, rotatePiece]);

	// Hard drop logic
	const hardDrop = useCallback((): void => {
		if (!currentPiece || gameOver || isPaused) return;

		let dropDistance = 0;
		while (
			isValidMove(
				0,
				dropDistance + 1,
				TETROMINOS[currentPiece].shape,
				currentPiece
			)
		) {
			dropDistance++;
		}

		setPosition((prev) => ({ ...prev, y: prev.y + dropDistance }));
		setScore((prev) => prev + POINTS.HARD_DROP * dropDistance);

		// After hard drop, the piece immediately lands
		updateBoard();
		checkLines();
		generateNewPiece();
	}, [
		currentPiece,
		gameOver,
		isPaused,
		isValidMove,
		updateBoard,
		checkLines,
		generateNewPiece,
	]);

	// Start game
	const startGame = useCallback((): void => {
		// Reset game state
		if (gameOver) {
			setBoard(createEmptyBoard());
			setScore(0);
			setLines(0);
			setLevel(1);
			setGameOver(false);
			setNextPiece(randomTetromino());
		}

		setIsPaused(false);
		setDropTime(speed);

		if (!currentPiece) {
			generateNewPiece();
		}
	}, [gameOver, currentPiece, generateNewPiece, speed]);

	// Pause game
	const pauseGame = useCallback((): void => {
		if (!gameOver) {
			setIsPaused(true);
			setDropTime(null);
		}
	}, [gameOver]);

	// Reset game
	const resetGame = useCallback((): void => {
		setBoard(createEmptyBoard());
		setCurrentPiece(null);
		setNextPiece(randomTetromino());
		setPosition({ x: 0, y: 0 });
		setScore(0);
		setLines(0);
		setLevel(1);
		setGameOver(false);
		setIsPaused(true);
		setDropTime(null);
		setRotation(0);
	}, []);

	// Game loop interval
	useEffect(() => {
		let dropInterval: NodeJS.Timeout | null = null;

		if (dropTime !== null && !isPaused && !gameOver) {
			dropInterval = setInterval(() => {
				moveDown();
			}, dropTime);
		}

		return () => {
			if (dropInterval) {
				clearInterval(dropInterval);
			}
		};
	}, [dropTime, isPaused, gameOver, moveDown]);

	// Update board every time position or current piece changes
	useEffect(() => {
		const renderBoard = () => {
			// Create a clean board without the active piece
			const newBoard = createEmptyBoard();

			// Copy frozen pieces from the old board
			for (let y = 0; y < BOARD_HEIGHT; y++) {
				for (let x = 0; x < BOARD_WIDTH; x++) {
					if (board[y][x] !== 0) {
						newBoard[y][x] = board[y][x];
					}
				}
			}

			// Add current active piece
			if (currentPiece) {
				const shape = TETROMINOS[currentPiece].shape;
				for (let y = 0; y < shape.length; y++) {
					for (let x = 0; x < shape[y].length; x++) {
						if (shape[y][x] !== 0) {
							const boardY = position.y + y;
							const boardX = position.x + x;

							// Only render pieces that are on the board
							if (
								boardY >= 0 &&
								boardY < BOARD_HEIGHT &&
								boardX >= 0 &&
								boardX < BOARD_WIDTH
							) {
								newBoard[boardY][boardX] = currentPiece;
							}
						}
					}
				}
			}

			setBoard(newBoard);
		};

		if (!gameOver && !isPaused) {
			renderBoard();
		}
	}, [position, currentPiece, isPaused, gameOver, board]);

	// Update drop speed when level changes
	useEffect(() => {
		if (!isPaused && !gameOver) {
			setDropTime(speed);
		}
	}, [level, isPaused, gameOver, speed]);

	return {
		board,
		score,
		level,
		lines,
		nextPiece,
		gameOver,
		isPaused,
		startGame,
		pauseGame,
		moveLeft,
		moveRight,
		rotate,
		moveDown,
		hardDrop,
		resetGame,
	};
};
