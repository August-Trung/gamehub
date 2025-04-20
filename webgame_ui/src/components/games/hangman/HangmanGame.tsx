import React, { useState, useEffect } from "react";
import HangmanDisplay from "./components/HangmanDisplay";
import WordDisplay from "./components/WordDisplay";
import LetterKeyboard from "./components/LetterKeyboard";
import CategorySelector from "./components/CategorySelector";
import HintButton from "./components/HintButton";
import { useHangmanGame } from "./hooks/useHangmanGame";
import { WORD_CATEGORIES } from "./data/wordCategories";

const HangmanGame: React.FC = () => {
	const [selectedCategory, setSelectedCategory] = useState("Programming");
	const [hintsRemaining, setHintsRemaining] = useState(3);
	const [activeHint, setActiveHint] = useState<string | null>(null);

	const categoryWords = WORD_CATEGORIES[selectedCategory] || [];

	const {
		word,
		guessedLetters,
		wrongGuesses,
		gameStatus,
		guessLetter,
		resetGame,
	} = useHangmanGame(categoryWords);

	useEffect(() => {
		resetGame();
	}, [selectedCategory, resetGame]);

	useEffect(() => {
		if (gameStatus === "playing") {
			setActiveHint(null);
		}
	}, [gameStatus]);

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category);
	};

	const requestHint = () => {
		if (hintsRemaining > 0 && gameStatus === "playing") {
			const unguessedLetters = word
				.split("")
				.filter((letter) => !guessedLetters.includes(letter));

			if (unguessedLetters.length > 0) {
				const randomIndex = Math.floor(
					Math.random() * unguessedLetters.length
				);
				const hintLetter = unguessedLetters[randomIndex];

				setActiveHint(`The word contains the letter "${hintLetter}"`);
				setHintsRemaining((prev) => prev - 1);
			}
		}
	};

	const handleResetGame = () => {
		resetGame();
		setHintsRemaining(3);
		setActiveHint(null);
	};

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (gameStatus !== "playing") return;

			const key = event.key.toUpperCase();

			if (/^[A-Z]$/.test(key) && !guessedLetters.includes(key)) {
				guessLetter(key);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [gameStatus, guessedLetters, guessLetter]);

	return (
		<div className="flex flex-col items-center justify-center bg-gray-100 p-4">
			<div className="w-full max-w-lg bg-white rounded-lg shadow-md p-6 mb-6">
				<div className="mb-6">
					<CategorySelector
						categories={Object.keys(WORD_CATEGORIES)}
						selectedCategory={selectedCategory}
						onSelectCategory={handleCategoryChange}
						disabled={gameStatus !== "playing"}
					/>
				</div>

				<HangmanDisplay wrongGuesses={wrongGuesses} />

				<div className="mt-4 text-center">
					<WordDisplay word={word} guessedLetters={guessedLetters} />
				</div>

				<div className="mt-4 flex flex-col items-center">
					<HintButton
						hintsRemaining={hintsRemaining}
						onRequestHint={requestHint}
						disabled={
							gameStatus !== "playing" || hintsRemaining <= 0
						}
					/>

					{activeHint && (
						<div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
							<p className="text-sm font-medium">
								💡 Hint: {activeHint}
							</p>
						</div>
					)}
				</div>

				{gameStatus === "playing" ? (
					<>
						<div className="mt-6">
							<LetterKeyboard
								guessedLetters={guessedLetters}
								onGuess={guessLetter}
							/>
						</div>
						<p className="text-sm text-gray-600 mt-4 text-center">
							You can also use your physical keyboard to guess
							letters
						</p>
					</>
				) : (
					<div className="mt-6 text-center">
						<p className="text-xl mb-4">
							{gameStatus === "won"
								? "🎉 Congratulations! You won!"
								: `😔 Game Over! The word was: ${word}`}
						</p>
						<button
							onClick={handleResetGame}
							className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg">
							Play Again
						</button>
					</div>
				)}
			</div>

			<div className="flex justify-between w-full max-w-lg px-4">
				<div className="text-sm text-gray-500">
					Remaining guesses: {6 - wrongGuesses.length}
				</div>
				<div className="text-sm text-gray-500">
					Hints remaining: {hintsRemaining}
				</div>
			</div>
		</div>
	);
};

export default HangmanGame;
