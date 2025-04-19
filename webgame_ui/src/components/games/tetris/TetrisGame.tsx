import { useState, useEffect, useCallback } from "react";
import "./styles/TetrisGame.css"; // Import the CSS file

// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 25;
// const CELL_SIZE = 25;

// Tetromino types and shapes
const TETROMINOS = {
	0: { shape: [[0]], color: "#111" },
	I: {
		shape: [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[0, 0, 0, 0],
			[0, 0, 0, 0],
		],
		color: "#00f0f0",
	},
	J: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[0, 0, 1],
		],
		color: "#0000f0",
	},
	L: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[1, 0, 0],
		],
		color: "#f0a000",
	},
	O: {
		shape: [
			[1, 1],
			[1, 1],
		],
		color: "#f0f000",
	},
	S: {
		shape: [
			[0, 0, 0],
			[0, 1, 1],
			[1, 1, 0],
		],
		color: "#00f000",
	},
	T: {
		shape: [
			[0, 0, 0],
			[1, 1, 1],
			[0, 1, 0],
		],
		color: "#a000f0",
	},
	Z: {
		shape: [
			[0, 0, 0],
			[1, 1, 0],
			[0, 1, 1],
		],
		color: "#f00000",
	},
};

// Types
type TetrominoType = keyof typeof TETROMINOS;
type Board = number[][];
type Tetromino = number[][];

interface PlayerType {
	pos: { x: number; y: number };
	tetromino: Tetromino;
	collided: boolean;
}

interface MoveType {
	x: number;
	y: number;
}

// Helper Functions
const createEmptyBoard = (): Board =>
	Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0));

const randomTetromino = (): TetrominoType => {
	const pieces: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"];
	return pieces[Math.floor(Math.random() * pieces.length)];
};

// Cell component
const Cell: React.FC<{ type: number }> = ({ type }) => (
	<div
		className="tetris-cell"
		style={{
			backgroundColor:
				type === 0
					? "#111"
					: TETROMINOS[Object.keys(TETROMINOS)[type] as TetrominoType]
							.color,
		}}
	/>
);

// Main component
export default function TetrisGame() {
	// Game state
	const [gameOver, setGameOver] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(0);
	const [board, setBoard] = useState(createEmptyBoard());
	const [player, setPlayer] = useState<PlayerType>({
		pos: { x: 0, y: 0 },
		tetromino: TETROMINOS[0].shape,
		collided: false,
	});
	const [nextPiece, setNextPiece] =
		useState<TetrominoType>(randomTetromino());
	const [dropTime, setDropTime] = useState<number | null>(null);

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

	// Reset the player position
	const resetPlayer = useCallback(() => {
		const piece = nextPiece;
		setNextPiece(randomTetromino());

		setPlayer({
			pos: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
			tetromino: TETROMINOS[piece].shape,
			collided: false,
		});
	}, [nextPiece]);

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
		[level]
	);

	// Move the tetromino left or right
	const movePlayer = useCallback(
		(dir: number) => {
			if (!isPaused && !gameOver) {
				if (!checkCollision(player, board, { x: dir, y: 0 })) {
					setPlayer((prev) => ({
						...prev,
						pos: { x: prev.pos.x + dir, y: prev.pos.y },
					}));
				}
			}
		},
		[player, board, checkCollision, isPaused, gameOver]
	);

	// Move the tetromino down
	const moveDown = useCallback(() => {
		if (!isPaused && !gameOver) {
			if (!checkCollision(player, board, { x: 0, y: 1 })) {
				setPlayer((prev) => ({
					...prev,
					pos: { x: prev.pos.x, y: prev.pos.y + 1 },
				}));
			} else {
				// Piece landed
				if (player.pos.y < 1) {
					// Game over
					setGameOver(true);
					setDropTime(null);
					return;
				}

				// Update the board with the landed piece
				setPlayer((prev) => ({
					...prev,
					collided: true,
				}));
			}
		}
	}, [player, board, checkCollision, isPaused, gameOver]);

	// Immediate drop to bottom
	const hardDrop = useCallback(() => {
		if (!isPaused && !gameOver) {
			let newY = player.pos.y;
			while (
				!checkCollision(player, board, {
					x: 0,
					y: newY - player.pos.y + 1,
				})
			) {
				newY++;
			}

			setPlayer((prev) => ({
				...prev,
				pos: { x: prev.pos.x, y: newY },
				collided: true,
			}));
		}
	}, [player, board, checkCollision, isPaused, gameOver]);

	// Rotate the tetromino
	const rotate = useCallback(() => {
		if (!isPaused && !gameOver) {
			// Deep clone to avoid direct state mutation
			const clonedPlayer = JSON.parse(JSON.stringify(player));

			// Perform rotation
			const rotatedTetromino = clonedPlayer.tetromino
				.map((_: number[], index: number) =>
					clonedPlayer.tetromino.map((col: number[]) => col[index])
				)
				.map((row: number[]) => row.reverse());

			clonedPlayer.tetromino = rotatedTetromino;

			// Check if rotation causes collision, if not apply it
			if (!checkCollision(clonedPlayer, board, { x: 0, y: 0 })) {
				setPlayer(clonedPlayer);
			}
		}
	}, [player, board, checkCollision, isPaused, gameOver]);

	// Start game
	const startGame = useCallback(() => {
		if (gameOver) {
			setBoard(createEmptyBoard());
			setScore(0);
			setLevel(1);
			setLines(0);
			setGameOver(false);
			setNextPiece(randomTetromino());
		}

		resetPlayer();
		setIsPaused(false);
		setDropTime(1000 / level);
	}, [gameOver, level, resetPlayer]);

	// Pause game
	const pauseGame = useCallback(() => {
		if (!gameOver) {
			setIsPaused(true);
			setDropTime(null);
		}
	}, [gameOver]);

	// Reset game
	const resetGame = useCallback(() => {
		setBoard(createEmptyBoard());
		setScore(0);
		setLevel(1);
		setLines(0);
		setGameOver(false);
		setIsPaused(true);
		setDropTime(null);
		setNextPiece(randomTetromino());
		setPlayer({
			pos: { x: 0, y: 0 },
			tetromino: TETROMINOS[0].shape,
			collided: false,
		});
	}, []);

	// Render the next piece preview
	const renderNextPiece = () => {
		return TETROMINOS[nextPiece].shape.map((row: number[], y) => (
			<div key={y} className="next-piece-row">
				{row.map((cell, x) => (
					<div
						key={`${y}-${x}`}
						className="next-piece-cell"
						style={{
							backgroundColor: cell
								? TETROMINOS[nextPiece].color
								: "#111",
							borderColor: cell ? "#333" : "#222",
						}}
					/>
				))}
			</div>
		));
	};

	// Render the current board with the active piece
	const renderBoard = () => {
		// Create a copy of the board
		const boardCopy = board.map((row) => [...row]);

		// Add the current tetromino to the board copy
		if (!gameOver && !isPaused && player.tetromino) {
			player.tetromino.forEach((row, y) => {
				row.forEach((value, x) => {
					if (value !== 0) {
						const boardY = y + player.pos.y;
						const boardX = x + player.pos.x;
						if (
							boardY >= 0 &&
							boardY < BOARD_HEIGHT &&
							boardX >= 0 &&
							boardX < BOARD_WIDTH
						) {
							boardCopy[boardY][boardX] = value;
						}
					}
				});
			});
		}

		return boardCopy.map((row, y) => (
			<div key={y} className="tetris-row">
				{row.map((cell, x) => (
					<Cell key={`${y}-${x}`} type={cell} />
				))}
			</div>
		));
	};

	// Handle keyboard controls
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (gameOver || isPaused) return;

			switch (e.key) {
				case "ArrowLeft":
					movePlayer(-1);
					break;
				case "ArrowRight":
					movePlayer(1);
					break;
				case "ArrowDown":
					moveDown();
					break;
				case "ArrowUp":
					rotate();
					break;
				case " ":
					hardDrop();
					break;
				case "p":
				case "P":
					pauseGame();
					break;
				default:
					break;
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [movePlayer, moveDown, rotate, hardDrop, pauseGame, gameOver, isPaused]);

	// Game loop - handle piece dropping
	useEffect(() => {
		if (!isPaused && !gameOver) {
			const dropSpeed = dropTime || 1000 / level;
			const timer = setInterval(() => {
				moveDown();
			}, dropSpeed);

			return () => {
				clearInterval(timer);
			};
		}
	}, [moveDown, dropTime, isPaused, gameOver, level]);

	// Update the board when a piece lands
	useEffect(() => {
		if (player.collided) {
			setBoard((prev) => updateBoard(prev, player));
			resetPlayer();
		}
	}, [player.collided, resetPlayer, updateBoard]);

	return (
		<div className="tetris-container">
			{/* Game board */}
			<div className="tetris-game-board">
				<div className="tetris-board-container">{renderBoard()}</div>
			</div>

			{/* Side panel */}
			<div className="tetris-side-panel">
				{/* Score board */}
				<div className="tetris-score-board">
					{gameOver && (
						<div className="tetris-game-over">Game Over</div>
					)}

					<div className="tetris-score-container">
						<div className="tetris-score-line">
							<span className="tetris-score-label">Score:</span>
							<span>{score}</span>
						</div>
						<div className="tetris-score-line">
							<span className="tetris-score-label">Level:</span>
							<span>{level}</span>
						</div>
						<div className="tetris-score-line">
							<span className="tetris-score-label">Lines:</span>
							<span>{lines}</span>
						</div>
					</div>

					<div className="tetris-next-piece-container">
						<h3>Next Piece</h3>
						<div className="tetris-next-piece-preview">
							{renderNextPiece()}
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="tetris-controls-panel">
					<div className="tetris-button-container">
						<button
							onClick={isPaused ? startGame : pauseGame}
							className="tetris-button">
							{gameOver
								? "New Game"
								: isPaused
									? "Start"
									: "Pause"}
						</button>
						<button onClick={resetGame} className="tetris-button">
							Reset
						</button>
					</div>

					<div className="tetris-controls-container">
						<div className="tetris-control-row">
							<button
								onClick={rotate}
								disabled={isPaused || gameOver}
								className={`tetris-control-button ${
									isPaused || gameOver ? "disabled" : ""
								}`}>
								Rotate
							</button>
						</div>
						<div className="tetris-direction-button-container">
							<button
								onClick={() => movePlayer(-1)}
								disabled={isPaused || gameOver}
								className={`tetris-direction-button ${
									isPaused || gameOver ? "disabled" : ""
								}`}>
								Left
							</button>
							<button
								onClick={moveDown}
								disabled={isPaused || gameOver}
								className={`tetris-direction-button ${
									isPaused || gameOver ? "disabled" : ""
								}`}>
								Down
							</button>
							<button
								onClick={() => movePlayer(1)}
								disabled={isPaused || gameOver}
								className={`tetris-direction-button ${
									isPaused || gameOver ? "disabled" : ""
								}`}>
								Right
							</button>
						</div>
						<div className="tetris-control-row">
							<button
								onClick={hardDrop}
								disabled={isPaused || gameOver}
								className={`tetris-control-button ${
									isPaused || gameOver ? "disabled" : ""
								}`}>
								Drop
							</button>
						</div>
					</div>

					<div className="tetris-keyboard-help">
						<h4 className="tetris-keyboard-header">
							Keyboard Controls:
						</h4>
						<p className="tetris-keyboard-instruction">
							← → : Move left/right
						</p>
						<p className="tetris-keyboard-instruction">
							↑ : Rotate
						</p>
						<p className="tetris-keyboard-instruction">
							↓ : Move down
						</p>
						<p className="tetris-keyboard-instruction">
							Space : Hard drop
						</p>
						<p className="tetris-keyboard-instruction">P : Pause</p>
					</div>
				</div>
			</div>
		</div>
	);
}
