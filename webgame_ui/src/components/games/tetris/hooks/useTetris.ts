import { useState, useEffect, useCallback } from "react";
import { useBoard } from "./useBoard";
import { usePlayer } from "./usePlayer";
import { BOARD_WIDTH, BOARD_HEIGHT } from "../constants/constants";
import { TetrominoType } from "../types/types";

// Helper Functions
export const createEmptyBoard = (): number[][] =>
	Array.from(Array(BOARD_HEIGHT), () => Array(BOARD_WIDTH).fill(0));

export const randomTetromino = (): TetrominoType => {
	const pieces: TetrominoType[] = ["I", "J", "L", "O", "S", "T", "Z"];
	return pieces[Math.floor(Math.random() * pieces.length)];
};

export const useTetris = () => {
	// Game state
	const [gameOver, setGameOver] = useState(false);
	const [isPaused, setIsPaused] = useState(true);
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [lines, setLines] = useState(0);
	const [nextPiece, setNextPiece] =
		useState<TetrominoType>(randomTetromino());
	const [dropTime, setDropTime] = useState<number | null>(null);

	// Custom hooks
	const { board, setBoard, updateBoard } = useBoard(
		level,
		setScore,
		setLines,
		setLevel
	);
	const { player, setPlayer, resetPlayer, checkCollision } = usePlayer(
		nextPiece,
		setNextPiece
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
		[player, board, checkCollision, isPaused, gameOver, setPlayer]
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
				// Check if game over - if collision occurs near the top of the board
				if (player.pos.y < 1) {
					setPlayer((prev) => ({
						...prev,
						collided: true,
					}));

					// Set game over immediately to prevent further actions
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
	}, [
		player,
		board,
		checkCollision,
		isPaused,
		gameOver,
		setPlayer,
		setGameOver,
		setDropTime,
	]);

	// Immediate drop to bottom
	const hardDrop = useCallback(() => {
		if (!isPaused && !gameOver) {
			let newY = player.pos.y;

			// Check how far we can drop
			while (
				!checkCollision(player, board, {
					x: 0,
					y: newY - player.pos.y + 1,
				})
			) {
				newY++;
			}

			// Check if we're at the top of the board (possible game over)
			if (newY <= 1) {
				setPlayer((prev) => ({
					...prev,
					pos: { x: prev.pos.x, y: newY },
					collided: true,
				}));

				// Set game over immediately to prevent further drops
				setGameOver(true);
				setDropTime(null);
			} else {
				// Normal drop
				setPlayer((prev) => ({
					...prev,
					pos: { x: prev.pos.x, y: newY },
					collided: true,
				}));
			}
		}
	}, [
		player,
		board,
		checkCollision,
		isPaused,
		gameOver,
		setPlayer,
		setGameOver,
		setDropTime,
	]);

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
	}, [player, board, checkCollision, isPaused, gameOver, setPlayer]);

	// Start game
	const startGame = useCallback(() => {
		const needsNewPiece =
			player.tetromino.length === 1 && player.tetromino[0].length === 1;

		if (gameOver || needsNewPiece) {
			if (gameOver) {
				setBoard(createEmptyBoard());
				setScore(0);
				setLevel(1);
				setLines(0);
				setGameOver(false);
			}
			resetPlayer();
		}

		setIsPaused(false);
		setDropTime(1000 / level);
	}, [gameOver, level, resetPlayer, setBoard, player.tetromino]);

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
			tetromino: [[0]],
			collided: false,
			tetrominoType: "0" as TetrominoType,
		});
	}, [setBoard, setPlayer]);

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

	useEffect(() => {
		// Update drop time when level changes
		if (!isPaused && !gameOver) {
			setDropTime(1000 / level);
		}
	}, [level, isPaused, gameOver]);

	// Keep the existing game loop but make it depend on dropTime only
	useEffect(() => {
		if (!isPaused && !gameOver && dropTime !== null) {
			const timer = setInterval(() => {
				moveDown();
			}, dropTime);

			return () => {
				clearInterval(timer);
			};
		}
	}, [moveDown, dropTime, isPaused, gameOver]);

	// Update the board when a piece lands
	useEffect(() => {
		if (player.collided) {
			setBoard((prev) => updateBoard(prev, player));
			resetPlayer();
		}
	}, [player.collided, resetPlayer, updateBoard, setBoard]);

	// Update the board when a piece lands
	useEffect(() => {
		if (player.collided) {
			// Check if game is over
			if (gameOver) {
				// Don't spawn new pieces if game is over
				return;
			}

			// Otherwise update board and spawn new piece
			setBoard((prev) => updateBoard(prev, player));
			resetPlayer();
		}
	}, [player.collided, resetPlayer, updateBoard, setBoard, gameOver]);

	return {
		board,
		player,
		nextPiece,
		gameOver,
		isPaused,
		score,
		level,
		lines,
		movePlayer,
		moveDown,
		rotate,
		hardDrop,
		startGame,
		pauseGame,
		resetGame,
	};
};
