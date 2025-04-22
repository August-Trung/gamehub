import React from "react";

interface ControlsProps {
	onRestart: () => void;
	boardSize: number;
	onBoardSizeChange: (size: number) => void;
}

const Controls: React.FC<ControlsProps> = ({
	onRestart,
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
