import React from "react";

interface WordDisplayProps {
	word: string;
	guessedLetters: string[];
}

const WordDisplay: React.FC<WordDisplayProps> = ({ word, guessedLetters }) => {
	return (
		<div className="flex justify-center space-x-2">
			{word.split("").map((letter, index) => (
				<div
					key={index}
					className="w-10 h-12 border-b-2 border-gray-800 flex items-center justify-center">
					<span className="text-2xl font-bold">
						{guessedLetters.includes(letter) ? letter : ""}
					</span>
				</div>
			))}
		</div>
	);
};

export default WordDisplay;
