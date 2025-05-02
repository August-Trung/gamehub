import React from "react";

interface MandarinSquareControlsProps {
	onMakeMove: () => void;
	onResetGame: () => void;
	canMove: boolean;
	isGameOver: boolean;
}

const MandarinSquareControls: React.FC<MandarinSquareControlsProps> = ({
	onMakeMove,
	onResetGame,
	canMove,
	isGameOver,
}) => {
	const showRules = () => {
		alert(`Game Rules:
1. Select a pocket with seeds and sow them counterclockwise.
2. If the last seed lands in a pocket that already has seeds, pick up all seeds from that pocket and continue sowing.
3. If the last seed lands in an empty pocket, and the next pocket is empty followed by a pocket with seeds, capture all seeds from that pocket and continue.
4. If the last seed lands in an empty pocket, and the next pocket has seeds, your turn ends and you capture those seeds.
5. If the last seed lands in an empty pocket, followed by two empty pockets, your turn ends.
6. If a player has no seeds in any of their pockets, they must use 5 seeds from their score to refill their pockets.
7. If a player doesn't have enough seeds to refill, they borrow from the opponent and pay back at the end.
8. Mandarin squares (red) are worth 10 points.`);
	};

	return (
		<div className="flex flex-col sm:flex-row gap-4 justify-center">
			{!isGameOver && (
				<button
					className={`px-4 py-2 rounded-md ${
						canMove
							? "bg-blue-500 hover:bg-blue-600 text-white"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
					onClick={onMakeMove}
					disabled={!canMove}>
					Sow Seeds
				</button>
			)}

			<button
				className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
				onClick={onResetGame}>
				Restart Game
			</button>

			{!isGameOver && (
				<button
					className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
					onClick={showRules}>
					Rules
				</button>
			)}
		</div>
	);
};

export default MandarinSquareControls;
