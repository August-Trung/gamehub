import React from "react";
import MandarinSquarePocket from "./MandarinSquarePocket";
import { GameState } from "../hooks/useMandarinSquareGame";
import { AnimationState } from "../hooks/useMandarinAnimation";

interface MandarinSquareBoardProps {
	gameState: GameState;
	selectedPocket: number | null;
	currentPlayer: 1 | 2;
	animationState: AnimationState;
	onSelectPocket: (index: number) => void;
}

const MandarinSquareBoard: React.FC<MandarinSquareBoardProps> = ({
	gameState,
	selectedPocket,
	currentPlayer,
	animationState,
	onSelectPocket,
}) => {
	const { board, scores } = gameState;

	// Divide the board into two rows
	const player1Pockets = board.slice(0, 5);
	const player2Pockets = board.slice(6, 11).reverse();
	const mandarinPockets = [board[5], board[11]];

	// Animation indicator
	const isAnimating = animationState.isAnimating;

	return (
		<div className="bg-amber-100 p-4 rounded-lg shadow-lg">
			<div className="flex justify-between mb-4">
				<div className="text-lg font-semibold">
					Player 1: {scores[0]} points
				</div>
				<div className="text-lg font-semibold">
					Player 2: {scores[1]} points
				</div>
			</div>

			{isAnimating && (
				<div className="mb-2 text-center text-blue-600 font-medium">
					Sowing seeds...
				</div>
			)}

			<div className="flex flex-col">
				{/* Top row (Player 2) */}
				<div className="flex justify-center mb-2">
					{player2Pockets.map((count, idx) => {
						const actualIdx = 10 - idx;
						return (
							<MandarinSquarePocket
								key={actualIdx}
								index={actualIdx}
								count={count}
								isSelected={selectedPocket === actualIdx}
								isSelectable={
									!isAnimating &&
									currentPlayer === 2 &&
									count > 0
								}
								isPlayerPocket={true}
								isCurrentPlayerPocket={currentPlayer === 2}
								animationState={animationState}
								onSelect={() =>
									!isAnimating &&
									currentPlayer === 2 &&
									count > 0 &&
									onSelectPocket(actualIdx)
								}
							/>
						);
					})}
				</div>

				{/* Mandarin row */}
				<div className="flex justify-between mb-2">
					<MandarinSquarePocket
						index={11}
						count={mandarinPockets[1]}
						isSelected={false}
						isSelectable={false}
						isPlayerPocket={false}
						isCurrentPlayerPocket={false}
						isMandarinPocket={true}
						animationState={animationState}
						onSelect={() => {}}
					/>
					<div className="flex-grow"></div>
					<MandarinSquarePocket
						index={5}
						count={mandarinPockets[0]}
						isSelected={false}
						isSelectable={false}
						isPlayerPocket={false}
						isCurrentPlayerPocket={false}
						isMandarinPocket={true}
						animationState={animationState}
						onSelect={() => {}}
					/>
				</div>

				{/* Bottom row (Player 1) */}
				<div className="flex justify-center">
					{player1Pockets.map((count, idx) => (
						<MandarinSquarePocket
							key={idx}
							index={idx}
							count={count}
							isSelected={selectedPocket === idx}
							isSelectable={
								!isAnimating && currentPlayer === 1 && count > 0
							}
							isPlayerPocket={true}
							isCurrentPlayerPocket={currentPlayer === 1}
							animationState={animationState}
							onSelect={() =>
								!isAnimating &&
								currentPlayer === 1 &&
								count > 0 &&
								onSelectPocket(idx)
							}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default MandarinSquareBoard;
