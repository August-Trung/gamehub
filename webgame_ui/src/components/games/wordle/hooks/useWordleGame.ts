// src/components/games/wordle/hooks/useWordleGame.ts
import { useState, useEffect } from "react";

export interface GameState {
	targetWord: string;
	guesses: string[][];
	currentRow: number;
	currentCol: number;
	gameOver: boolean;
	message: string;
	keyboardStatus: Record<
		string,
		"correct" | "present" | "absent" | undefined
	>;
	shakingRow: boolean;
	lastAddedLetter: { row: number; col: number };
	processingInput: boolean;
}

export const useWordleGame = () => {
	const [wordBank] = useState<string[]>([
		"REACT",
		"FLASK",
		"GAMMA",
		"PIXEL",
		"BYTES",
		"DELTA",
		"FOCUS",
		"NEXUS",
		"QUERY",
		"ALPHA",
		"OCEAN",
		"CODER",
		"LOOPS",
		"WORLD",
		"JUMBO",
		"PLANE",
		"MUSIC",
		"BOOKS",
		"SMART",
		"HYDRA",
		"LIGHT",
		"BLOCK",
		"CRISP",
		"BRICK",
		"DRIVE",
		"CLOUD",
		"VIRAL",
		"SCORE",
		"TREND",
		"BLAST",
		"NODES",
		"STACK",
		"INPUT",
		"LOGIC",
		"ARRAY",
		"RANGE",
		"MODAL",
		"ERROR",
		"CLICK",
		"SHIFT",
		"GUESS",
		"LEVEL",
		"BLINK",
		"ZEBRA",
		"MIGHT",
		"SLEEP",
		"FRAME",
		"QUIRK",
		"PIXIE",
		"CHAIR",
		"SPEAK",
		"DREAM",
		"ROBOT",
		"CABLE",
		"TRUST",
		"GRAPE",
		"GLASS",
		"BRAVE",
		"SWIFT",
		"STONE",
		"SUGAR",
		"NINJA",
		"RADAR",
		"MAGIC",
		"TREES",
	]);

	const [gameState, setGameState] = useState<GameState>({
		targetWord: "",
		guesses: [Array(5).fill("")],
		currentRow: 0,
		currentCol: 0,
		gameOver: false,
		message: "",
		keyboardStatus: {},
		shakingRow: false,
		lastAddedLetter: { row: -1, col: -1 },
		processingInput: false,
	});

	// Initialize the game
	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * wordBank.length);
		setGameState((prev) => ({
			...prev,
			targetWord: wordBank[randomIndex],
			keyboardStatus: {},
		}));
	}, [wordBank]);

	// Handle shake row animation
	useEffect(() => {
		if (gameState.shakingRow) {
			const timer = setTimeout(() => {
				setGameState((prev) => ({ ...prev, shakingRow: false }));
			}, 500);
			return () => clearTimeout(timer);
		}
	}, [gameState.shakingRow]);

	const handleKeyPress = (key: string): void => {
		if (gameState.gameOver) return;

		// Handle letter input
		if (/^[A-Za-z]$/.test(key) && gameState.currentCol < 5) {
			const newGuesses = [...gameState.guesses];
			newGuesses[gameState.currentRow][gameState.currentCol] =
				key.toUpperCase();

			setGameState((prev) => ({
				...prev,
				guesses: newGuesses,
				currentCol: prev.currentCol + 1,
				lastAddedLetter: { row: prev.currentRow, col: prev.currentCol },
			}));

			// Reset the last added letter animation after a short delay
			setTimeout(() => {
				setGameState((prev) => ({
					...prev,
					lastAddedLetter: { row: -1, col: -1 },
				}));
			}, 300);
		}

		// Handle backspace
		if (
			(key === "Backspace" || key === "←" || key === "Backspace") &&
			gameState.currentCol > 0
		) {
			const newGuesses = [...gameState.guesses];
			newGuesses[gameState.currentRow][gameState.currentCol - 1] = "";

			setGameState((prev) => ({
				...prev,
				guesses: newGuesses,
				currentCol: prev.currentCol - 1,
			}));
		}

		// Handle enter
		if (key === "Enter" && gameState.currentCol === 5) {
			const currentGuess =
				gameState.guesses[gameState.currentRow].join("");

			// Check if word is valid (in this simple version, we're not checking against a dictionary)
			if (currentGuess.length !== 5) {
				setGameState((prev) => ({ ...prev, shakingRow: true }));
				return;
			}

			// Check if guess is correct
			if (currentGuess === gameState.targetWord) {
				setGameState((prev) => ({
					...prev,
					gameOver: true,
					message: "You won! 🎉",
				}));
				return;
			}

			// Update keyboard status
			const newKeyboardStatus = { ...gameState.keyboardStatus };

			for (let i = 0; i < 5; i++) {
				const letter = gameState.guesses[gameState.currentRow][i];

				if (letter === gameState.targetWord[i]) {
					newKeyboardStatus[letter] = "correct";
				} else if (gameState.targetWord.includes(letter)) {
					// Only update if not already marked as correct
					if (newKeyboardStatus[letter] !== "correct") {
						newKeyboardStatus[letter] = "present";
					}
				} else {
					// Only update if not already marked
					if (!newKeyboardStatus[letter]) {
						newKeyboardStatus[letter] = "absent";
					}
				}
			}

			// Move to next row or end game
			if (gameState.currentRow === 5) {
				setGameState((prev) => ({
					...prev,
					gameOver: true,
					message: `Game over. The word was ${gameState.targetWord}.`,
				}));
			} else {
				const newGuesses = [...gameState.guesses];
				newGuesses.push(Array(5).fill(""));

				setGameState((prev) => ({
					...prev,
					guesses: newGuesses,
					currentRow: prev.currentRow + 1,
					currentCol: 0,
					keyboardStatus: newKeyboardStatus,
				}));
			}
		}
	};

	const resetGame = (): void => {
		const randomIndex = Math.floor(Math.random() * wordBank.length);
		setGameState({
			targetWord: wordBank[randomIndex],
			guesses: [Array(5).fill("")],
			currentRow: 0,
			currentCol: 0,
			gameOver: false,
			message: "",
			keyboardStatus: {},
			shakingRow: false,
			lastAddedLetter: { row: -1, col: -1 },
			processingInput: false,
		});
	};

	return {
		gameState,
		setGameState,
		handleKeyPress,
		resetGame,
	};
};
