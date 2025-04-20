import React from "react";

interface HangmanDisplayProps {
	wrongGuesses: string[];
}

const HangmanDisplay: React.FC<HangmanDisplayProps> = ({ wrongGuesses }) => {
	const maxWrongGuesses = 6;
	const wrongGuessCount = wrongGuesses.length;

	// SVG parts to draw progressively as wrong guesses increase
	const parts = [
		// Head
		<circle
			key="head"
			cx="200"
			cy="80"
			r="20"
			stroke="black"
			strokeWidth="4"
			fill="none"
		/>,
		// Body
		<line
			key="body"
			x1="200"
			y1="100"
			x2="200"
			y2="150"
			stroke="black"
			strokeWidth="4"
		/>,
		// Left arm
		<line
			key="leftArm"
			x1="200"
			y1="120"
			x2="170"
			y2="140"
			stroke="black"
			strokeWidth="4"
		/>,
		// Right arm
		<line
			key="rightArm"
			x1="200"
			y1="120"
			x2="230"
			y2="140"
			stroke="black"
			strokeWidth="4"
		/>,
		// Left leg
		<line
			key="leftLeg"
			x1="200"
			y1="150"
			x2="180"
			y2="190"
			stroke="black"
			strokeWidth="4"
		/>,
		// Right leg
		<line
			key="rightLeg"
			x1="200"
			y1="150"
			x2="220"
			y2="190"
			stroke="black"
			strokeWidth="4"
		/>,
	];

	// Only show parts corresponding to wrong guesses
	const visibleParts = parts.slice(0, wrongGuessCount);

	return (
		<div className="flex flex-col items-center">
			<div className="relative">
				<svg viewBox="0 0 300 220" width="300" height="220">
					{/* Gallows */}
					<line
						x1="60"
						y1="20"
						x2="200"
						y2="20"
						stroke="black"
						strokeWidth="4"
					/>
					<line
						x1="60"
						y1="20"
						x2="60"
						y2="200"
						stroke="black"
						strokeWidth="4"
					/>
					<line
						x1="40"
						y1="200"
						x2="80"
						y2="200"
						stroke="black"
						strokeWidth="4"
					/>
					<line
						x1="200"
						y1="20"
						x2="200"
						y2="60"
						stroke="black"
						strokeWidth="4"
					/>

					{/* Hangman parts - rendered based on wrong guesses */}
					{visibleParts}
				</svg>
			</div>

			{wrongGuesses.length > 0 && (
				<div className="mt-4">
					<p className="text-center">
						<span className="font-semibold">Wrong guesses:</span>{" "}
						{wrongGuesses.join(", ")}
					</p>
				</div>
			)}

			<div className="mt-2 text-sm">
				<span
					className={
						wrongGuessCount >= maxWrongGuesses
							? "text-red-600 font-bold"
							: ""
					}>
					{wrongGuessCount}/{maxWrongGuesses} wrong guesses
				</span>
			</div>
		</div>
	);
};

export default HangmanDisplay;
