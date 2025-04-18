import React from "react";

interface ControlsProps {
	difficulty: string;
	setDifficulty: (difficulty: string) => void;
	onNewGame: () => void;
	onSolve: () => void;
	onClear: () => void;
	onCheck: () => void;
	onHint: () => void;
	isSolving: boolean;
	isGameCompleted: boolean;
}

const Controls: React.FC<ControlsProps> = ({
	difficulty,
	setDifficulty,
	onNewGame,
	onSolve,
	onClear,
	onCheck,
	onHint,
	isSolving,
	isGameCompleted,
}) => {
	return (
		<div className="w-full space-y-4">
			<div className="flex items-center justify-between">
				<select
					title="Difficulty"
					className="block p-2 border border-gray-300 rounded"
					value={difficulty}
					onChange={(e) => setDifficulty(e.target.value)}>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
					<option value="expert">Expert</option>
				</select>

				<button
					className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
					onClick={onNewGame}>
					New Game
				</button>
			</div>

			<div className="grid grid-cols-9 gap-2">
				{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
					<button
						key={num}
						className="bg-gray-200 hover:bg-gray-300 text-center py-2 rounded text-lg"
						onClick={() =>
							document.dispatchEvent(
								new KeyboardEvent("keydown", {
									key: num.toString(),
								})
							)
						}>
						{num}
					</button>
				))}
			</div>

			<div className="flex space-x-2">
				<button
					className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded"
					onClick={() =>
						document.dispatchEvent(
							new KeyboardEvent("keydown", { key: "Backspace" })
						)
					}>
					Clear Cell
				</button>
				<button
					className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded"
					onClick={() =>
						document.dispatchEvent(
							new KeyboardEvent("keydown", { key: "n" })
						)
					}>
					Note Mode
				</button>
			</div>

			<div className="flex space-x-2">
				<button
					className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
					onClick={onHint}
					disabled={isGameCompleted}>
					Hint
				</button>
				<button
					className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
					onClick={onCheck}>
					Check
				</button>
			</div>

			<div className="flex space-x-2">
				<button
					className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded"
					onClick={onClear}>
					Reset
				</button>
				<button
					className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
					onClick={onSolve}
					disabled={isSolving}>
					{isSolving ? "Solving..." : "Solve"}
				</button>
			</div>
		</div>
	);
};

export default Controls;
