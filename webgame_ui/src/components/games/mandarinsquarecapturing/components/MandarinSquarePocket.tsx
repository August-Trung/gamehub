import React from "react";
import { AnimationState } from "../hooks/useMandarinAnimation";

interface MandarinSquarePocketProps {
	index: number;
	count: number;
	isSelected: boolean;
	isSelectable: boolean;
	isPlayerPocket: boolean;
	isCurrentPlayerPocket: boolean;
	isMandarinPocket?: boolean;
	animationState?: AnimationState;
	onSelect: () => void;
}

const MandarinSquarePocket: React.FC<MandarinSquarePocketProps> = ({
	index,
	count,
	isSelected,
	isSelectable,
	isPlayerPocket,
	isCurrentPlayerPocket,
	isMandarinPocket = false,
	animationState,
	onSelect,
}) => {
	// Determine if this pocket is currently being animated
	const isAnimating = animationState?.currentSowingIndex === index;
	const wasLastSown = animationState?.lastSownIndex === index;
	const isAnimationActive = animationState?.isAnimating;

	// Determine size and color based on pocket type
	const pocketSize = isMandarinPocket ? "w-16 h-16" : "w-12 h-12";

	let pocketColor = "bg-amber-200 hover:bg-amber-300";
	if (isMandarinPocket) {
		pocketColor = "bg-red-300 hover:bg-red-400";
	} else if (isSelected) {
		pocketColor = "bg-green-300 hover:bg-green-400";
	} else if (isAnimating) {
		pocketColor = "bg-blue-300";
	} else if (wasLastSown && isAnimationActive) {
		pocketColor = "bg-blue-200";
	} else if (!isSelectable) {
		pocketColor = "bg-amber-200 opacity-70";
	}

	// Add border for current player
	const borderStyle =
		isCurrentPlayerPocket && isPlayerPocket
			? "border-2 border-blue-500"
			: "border border-amber-500";

	// Add animation effects
	const animationEffect = isAnimating
		? "animate-pulse shadow-lg"
		: wasLastSown && isAnimationActive
			? "shadow-md"
			: "";

	// Add arrow for animation direction
	const showArrow = isAnimating && isAnimationActive;

	return (
		<button
			className={`${pocketSize} ${pocketColor} ${borderStyle} ${animationEffect} rounded-full mx-1 flex items-center justify-center relative ${isSelectable ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
			onClick={isSelectable ? onSelect : undefined}
			disabled={!isSelectable}>
			<span className="text-lg font-bold">{count}</span>

			{/* Animation direction arrow */}
			{showArrow && (
				<div className="absolute -bottom-6 left-0 right-0 flex justify-center">
					<div className="animate-bounce text-blue-600 text-xl">
						↓
					</div>
				</div>
			)}
		</button>
	);
};

export default MandarinSquarePocket;
