import React from "react";

interface ControlsProps {
	onRestart: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
	boardSize: number;
	onBoardSizeChange: (size: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
	onRestart,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
	boardSize,
	onBoardSizeChange,
}) => {
	return (
		<div className="w-full space-y-4">
			{/* New Game button - full width */}
			<button
				className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded"
				onClick={onRestart}>
				New Game
			</button>

			{/* Undo/Redo buttons in a row */}
			<div className="flex gap-2">
				<button
					className={`flex-1 py-2 px-4 rounded ${canUndo ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
					onClick={onUndo}
					disabled={!canUndo}>
					Undo
				</button>

				<button
					className={`flex-1 py-2 px-4 rounded ${canRedo ? "bg-blue-500 hover:bg-blue-600 text-white" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
					onClick={onRedo}
					disabled={!canRedo}>
					Redo
				</button>
			</div>

			{/* Board Size selection */}
			<div>
				<label className="block text-gray-700 mb-2">Board Size:</label>
				<div className="grid grid-cols-3 gap-2">
					{[10, 15, 19].map((size) => (
						<button
							key={size}
							className={`py-2 px-1 rounded text-center ${boardSize === size ? "bg-green-500 text-white" : "bg-gray-200 hover:bg-gray-300"}`}
							onClick={() => onBoardSizeChange(size)}>
							{size}×{size}
						</button>
					))}
				</div>
			</div>
		</div>
	);
};

export default Controls;
