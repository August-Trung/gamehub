// src/components/games/wordle/WordleGame.tsx
import { useEffect } from "react";
import { useWordleGame } from "./hooks/useWordleGame";
import WordleBoard from "./components/WordleBoard";
import WordleKeyboard from "./components/WordleKeyboard";

export default function WordleGame(): JSX.Element {
	const { gameState, setGameState, handleKeyPress, resetGame } =
		useWordleGame();

	// Handle physical keyboard input
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const isFromVirtualKeyboard =
				document.activeElement?.id === "virtual-keyboard-input";

			// Add this check to prevent duplicate input handling
			if (gameState.processingInput || isFromVirtualKeyboard) return;

			// Set processing flag to prevent duplicates
			setGameState((prev) => ({ ...prev, processingInput: true }));

			handleKeyPress(event.key);

			// Reset processing flag after a short delay
			setTimeout(() => {
				setGameState((prev) => ({ ...prev, processingInput: false }));
			}, 50);
		};

		window.addEventListener("keydown", handleKeyDown as any);
		return () => {
			window.removeEventListener("keydown", handleKeyDown as any);
		};
	}, [gameState, handleKeyPress, setGameState]);

	// Add support for touch events for mobile devices
	useEffect(() => {
		// Focus an invisible input to make sure keyboard pops up on mobile
		const focusInput = () => {
			const inputElement = document.getElementById(
				"virtual-keyboard-input"
			);
			if (inputElement) {
				inputElement.focus();
			}
		};

		document.addEventListener("touchstart", focusInput);

		return () => {
			document.removeEventListener("touchstart", focusInput);
		};
	}, []);

	return (
		<div className="max-w-md mx-auto p-4">
			<h2 className="text-2xl font-bold mb-6 text-center">Wordle</h2>

			{/* Hidden input for mobile keyboard support */}
			<input
				title="Virtual Keyboard Input"
				id="virtual-keyboard-input"
				type="text"
				className="opacity-0 h-0 w-0 absolute"
				autoCapitalize="none"
				autoComplete="off"
				autoCorrect="off"
				autoFocus
				onBlur={(e) => e.target.focus()}
				onChange={(e) => {
					const value = e.target.value;
					if (value.length > 0) {
						handleKeyPress(value[value.length - 1]);
						e.target.value = "";
					}
				}}
				onKeyDown={(e) => {
					// Handle special keys
					if (e.key === "Backspace" || e.key === "Enter") {
						e.preventDefault();
						handleKeyPress(e.key);
					}
				}}
			/>

			{gameState.message && (
				<div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-center animate-fadeIn">
					{gameState.message}
					{gameState.gameOver && (
						<button
							className="ml-4 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-300"
							onClick={resetGame}>
							Play Again
						</button>
					)}
				</div>
			)}

			<WordleBoard gameState={gameState} />
			<WordleKeyboard
				keyboardStatus={gameState.keyboardStatus}
				onKeyPress={handleKeyPress}
			/>

			<div className="mt-6 text-center">
				<p className="text-gray-600 text-sm">
					Guess the 5-letter word in 6 tries.
					<br />
					Green tiles mean the letter is correct. Yellow tiles mean
					the letter exists but in a different position.
				</p>
				<p className="text-gray-500 text-xs mt-2">
					You can use your physical keyboard or tap the on-screen
					keyboard.
				</p>
			</div>

			<style>{`
				@keyframes flipIn {
					0% {
						transform: rotateX(0);
						background-color: #fff;
					}
					50% {
						transform: rotateX(90deg);
					}
					100% {
						transform: rotateX(0);
					}
				}

				@keyframes wobble {
					0% {
						transform: translateX(0);
					}
					15% {
						transform: translateX(-5px);
					}
					30% {
						transform: translateX(5px);
					}
					45% {
						transform: translateX(-5px);
					}
					60% {
						transform: translateX(5px);
					}
					75% {
						transform: translateX(-5px);
					}
					90% {
						transform: translateX(5px);
					}
					100% {
						transform: translateX(0);
					}
				}

				@keyframes popIn {
					0% {
						transform: scale(0.8);
						opacity: 0.5;
					}
					50% {
						transform: scale(1.1);
					}
					100% {
						transform: scale(1);
						opacity: 1;
					}
				}

				.wobble {
					animation: wobble 0.5s ease-in-out;
				}

				.pop-in {
					animation: popIn 0.3s ease-in-out forwards;
				}

				.reveal-row > div {
					animation: flipIn 0.5s ease-in-out forwards;
					animation-delay: var(--reveal-delay-0);
				}

				.reveal-row > div:nth-child(2) {
					animation-delay: var(--reveal-delay-1);
				}

				.reveal-row > div:nth-child(3) {
					animation-delay: var(--reveal-delay-2);
				}

				.reveal-row > div:nth-child(4) {
					animation-delay: var(--reveal-delay-3);
				}

				.reveal-row > div:nth-child(5) {
					animation-delay: var(--reveal-delay-4);
				}
			`}</style>
		</div>
	);
}
