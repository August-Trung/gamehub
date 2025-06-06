// src/components/games/wordle/components/WordleBoard.tsx
import WordleTile from "./WordleTile";
import { GameState } from "../hooks/useWordleGame";

interface WordleBoardProps {
	gameState: GameState;
}

export default function WordleBoard({ gameState }: WordleBoardProps) {
	const { guesses, currentRow, targetWord, shakingRow, lastAddedLetter } =
		gameState;

	const getRowAnimation = (
		rowIndex: number
	): { className: string; style: React.CSSProperties } => {
		const delayBase = 150; // milliseconds

		if (rowIndex < currentRow) {
			const style = Object.fromEntries(
				Array.from({ length: 5 }, (_, i) => [
					`--reveal-delay-${i}`,
					`${delayBase * i}ms`,
				])
			) as React.CSSProperties & Record<string, string>;

			return {
				className: "reveal-row",
				style,
			};
		}

		return { className: "", style: {} };
	};

	return (
		<div className="mb-6">
			{guesses.map((row, rowIndex) => {
				const rowAnim = getRowAnimation(rowIndex);

				return (
					<div
						key={`row-${rowIndex}`}
						className={`flex justify-center mb-2 ${shakingRow && rowIndex === currentRow ? "wobble" : ""} ${rowAnim.className}`}
						style={rowAnim.style}>
						{row.map((letter, colIndex) => (
							<WordleTile
								key={`cell-${rowIndex}-${colIndex}`}
								letter={letter}
								row={rowIndex}
								col={colIndex}
								currentRow={currentRow}
								targetWord={targetWord}
								shakingRow={shakingRow}
								lastAddedLetter={lastAddedLetter}
							/>
						))}
					</div>
				);
			})}
		</div>
	);
}
