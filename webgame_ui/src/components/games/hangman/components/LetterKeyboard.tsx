import React from "react";

interface LetterKeyboardProps {
	guessedLetters: string[];
	onGuess: (letter: string) => void;
}

const LetterKeyboard: React.FC<LetterKeyboardProps> = ({
	guessedLetters,
	onGuess,
}) => {
	// Define all the keyboard letters
	const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

	// Group the alphabet into rows for better display
	const keyboardRows = [
		alphabet.slice(0, 9), // A-I
		alphabet.slice(9, 18), // J-R
		alphabet.slice(18), // S-Z
	];

	return (
		<div className="flex flex-col items-center space-y-2">
			{keyboardRows.map((row, rowIndex) => (
				<div key={rowIndex} className="flex justify-center gap-1">
					{row.map((letter) => {
						const isGuessed = guessedLetters.includes(letter);

						return (
							<button
								key={letter}
								className={`w-7 h-9 sm:w-10 sm:h-12 rounded-md lg:text-lg md:text-lg text-sm ${
									isGuessed
										? "bg-gray-300 text-gray-500 cursor-not-allowed"
										: "bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white"
								}`}
								onClick={() => !isGuessed && onGuess(letter)}
								disabled={isGuessed}
								aria-label={`Letter ${letter}`}>
								{letter}
							</button>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default LetterKeyboard;
