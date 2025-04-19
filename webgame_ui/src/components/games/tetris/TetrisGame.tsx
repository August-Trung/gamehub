import { useState, useEffect, useCallback } from "react";

// Constants
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

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

// Main component
export default function TetrisGame() {
	// Game state
	const [gameOver, setGameOver] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(0);
	const [board, setBoard] = useState(createEmptyBoard());
	const [player, setPlayer] = useState({
		pos: { x: 0, y: 0 },
		tetromino: TETROMINOS[0].shape,
		collided: false,
	});
	const [nextPiece, setNextPiece] = useState(randomTetromino());
	const [dropTime, setDropTime] = useState(null);

	// Create an empty board
	function createEmptyBoard() {
		return Array.from(Array(BOARD_HEIGHT), () =>
			Array(BOARD_WIDTH).fill(0)
		);
	}

	// Get a random tetromino
	function randomTetromino() {
		const pieces = "IJLOSTZ";
		const randPiece = pieces[Math.floor(Math.random() * pieces.length)];
		return randPiece;
	}

	// Reset the player position
	const resetPlayer = useCallback(() => {
		const piece = nextPiece;
		setNextPiece(randomTetromino());

		setPlayer({
			pos: { x: BOARD_WIDTH / 2 - 1, y: 0 },
			tetromino: TETROMINOS[piece].shape,
			collided: false,
		});
	}, [nextPiece]);

	// Update the board when a piece lands
	const updateBoard = useCallback(
		(prevBoard, player) => {
			// Deep clone the board
			const newBoard = prevBoard.map((row) => row.slice());

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
			const updatedBoard = newBoard.reduce((acc, row) => {
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

	// Check for collisions
	const checkCollision = useCallback(
		(player, board, { x: moveX, y: moveY }) => {
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

	// Move the tetromino left or right
	const movePlayer = useCallback(
		(dir) => {
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
				.map((_, index) =>
					clonedPlayer.tetromino.map((col) => col[index])
				)
				.map((row) => row.reverse());

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

	// Handle keyboard controls
	useEffect(() => {
		const handleKeyDown = (e) => {
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
			const timer = setInterval(
				() => {
					moveDown();
				},
				dropTime || 1000 / level
			);

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

	// Draw a single cell
	const Cell = ({ type }) => (
		<div
			style={{
				width: CELL_SIZE,
				height: CELL_SIZE,
				backgroundColor:
					type === 0
						? "#111"
						: TETROMINOS[Object.keys(TETROMINOS)[type] || 0].color,
				border: "1px solid #333",
			}}
		/>
	);

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
			<div key={y} style={{ display: "flex" }}>
				{row.map((cell, x) => (
					<Cell key={`${y}-${x}`} type={cell} />
				))}
			</div>
		));
	};

	// Render the next piece preview
	const renderNextPiece = () => {
		return TETROMINOS[nextPiece].shape.map((row, y) => (
			<div key={y} style={{ display: "flex" }}>
				{row.map((cell, x) => (
					<div
						key={`${y}-${x}`}
						style={{
							width: 20,
							height: 20,
							backgroundColor: cell
								? TETROMINOS[nextPiece].color
								: "#111",
							border: cell ? "1px solid #333" : "1px solid #222",
						}}
					/>
				))}
			</div>
		));
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "row",
				gap: "20px",
				fontFamily: "Arial, sans-serif",
				color: "white",
			}}>
			{/* Game board */}
			<div
				style={{
					backgroundColor: "#111",
					padding: "10px",
					borderRadius: "4px",
					boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
				}}>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						border: "2px solid #333",
					}}>
					{renderBoard()}
				</div>
			</div>

			{/* Side panel */}
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "20px",
					width: "200px",
				}}>
				{/* Score board */}
				<div
					style={{
						backgroundColor: "#222",
						padding: "15px",
						borderRadius: "4px",
					}}>
					{gameOver && (
						<div
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								color: "#f00",
								marginBottom: "15px",
								textAlign: "center",
							}}>
							Game Over
						</div>
					)}

					<div style={{ marginBottom: "20px" }}>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}>
							<span style={{ fontWeight: "bold" }}>Score:</span>
							<span>{score}</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}>
							<span style={{ fontWeight: "bold" }}>Level:</span>
							<span>{level}</span>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								marginBottom: "8px",
							}}>
							<span style={{ fontWeight: "bold" }}>Lines:</span>
							<span>{lines}</span>
						</div>
					</div>

					<div style={{ marginTop: "10px", textAlign: "center" }}>
						<h3>Next Piece</h3>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								backgroundColor: "#111",
								padding: "10px",
								marginTop: "10px",
							}}>
							{renderNextPiece()}
						</div>
					</div>
				</div>

				{/* Controls */}
				<div
					style={{
						backgroundColor: "#222",
						padding: "15px",
						borderRadius: "4px",
					}}>
					<div
						style={{
							display: "flex",
							justifyContent: "space-between",
							marginBottom: "15px",
						}}>
						<button
							onClick={isPaused ? startGame : pauseGame}
							style={{
								padding: "8px 16px",
								backgroundColor: "#444",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontSize: "14px",
							}}>
							{gameOver
								? "New Game"
								: isPaused
									? "Resume"
									: "Pause"}
						</button>
						<button
							onClick={resetGame}
							style={{
								padding: "8px 16px",
								backgroundColor: "#444",
								color: "white",
								border: "none",
								borderRadius: "4px",
								cursor: "pointer",
								fontSize: "14px",
							}}>
							Reset
						</button>
					</div>

					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "10px",
							marginBottom: "15px",
						}}>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}>
							<button
								onClick={rotate}
								style={{
									padding: "10px",
									width: "100%",
									backgroundColor: "#444",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}>
								Rotate
							</button>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								gap: "5px",
							}}>
							<button
								onClick={() => movePlayer(-1)}
								style={{
									flex: 1,
									padding: "10px",
									backgroundColor: "#444",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}>
								Left
							</button>
							<button
								onClick={moveDown}
								style={{
									flex: 1,
									padding: "10px",
									backgroundColor: "#444",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}>
								Down
							</button>
							<button
								onClick={() => movePlayer(1)}
								style={{
									flex: 1,
									padding: "10px",
									backgroundColor: "#444",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}>
								Right
							</button>
						</div>
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}>
							<button
								onClick={hardDrop}
								style={{
									padding: "10px",
									width: "100%",
									backgroundColor: "#444",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}>
								Drop
							</button>
						</div>
					</div>

					<div
						style={{
							fontSize: "12px",
							color: "#aaa",
						}}>
						<h4 style={{ marginBottom: "5px" }}>
							Keyboard Controls:
						</h4>
						<p style={{ margin: "3px 0" }}>← → : Move left/right</p>
						<p style={{ margin: "3px 0" }}>↑ : Rotate</p>
						<p style={{ margin: "3px 0" }}>↓ : Move down</p>
						<p style={{ margin: "3px 0" }}>Space : Hard drop</p>
						<p style={{ margin: "3px 0" }}>P : Pause</p>
					</div>
				</div>
			</div>
		</div>
	);
}
