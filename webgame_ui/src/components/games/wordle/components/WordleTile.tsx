// src/components/games/wordle/components/WordleTile.tsx
interface WordleTileProps {
	letter: string;
	row: number;
	col: number;
	currentRow: number;
	targetWord: string;
	shakingRow: boolean;
	lastAddedLetter: { row: number; col: number };
}

export default function WordleTile({
	letter,
	row,
	col,
	currentRow,
	targetWord,
	shakingRow,
	lastAddedLetter,
}: WordleTileProps) {
	const getLetterColor = (): string => {
		if (row > currentRow) return "bg-gray-200";
		if (row === currentRow && !letter) return "bg-gray-200";
		if (row < currentRow) {
			if (letter === targetWord[col]) {
				return "bg-green-500 text-white";
			} else if (targetWord.includes(letter)) {
				return "bg-yellow-500 text-white";
			} else {
				return "bg-gray-500 text-white";
			}
		}
		return "bg-white border-2 border-gray-300";
	};

	const getLetterAnimation = (): string => {
		if (shakingRow && row === currentRow) {
			return "wobble";
		}
		if (lastAddedLetter.row === row && lastAddedLetter.col === col) {
			return "pop-in";
		}
		return "";
	};

	return (
		<div
			className={`w-12 h-12 mx-1 flex items-center justify-center font-bold text-lg ${getLetterColor()} ${getLetterAnimation()} transition-colors duration-500`}
			style={{
				transitionDelay: row < currentRow ? `${col * 150}ms` : "0ms",
			}}>
			{letter}
		</div>
	);
}
