import { useState } from "react";

export interface AnimationState {
	isAnimating: boolean;
	currentSowingIndex: number | null;
	animationDirection: "clockwise" | "counterclockwise";
	lastSownIndex: number | null;
}

export const useMandarinAnimation = () => {
	const [animationState, setAnimationState] = useState<AnimationState>({
		isAnimating: false,
		currentSowingIndex: null,
		animationDirection: "counterclockwise",
		lastSownIndex: null,
	});

	const startAnimation = (startIndex: number) => {
		setAnimationState({
			isAnimating: true,
			currentSowingIndex: startIndex,
			animationDirection: "counterclockwise",
			lastSownIndex: null,
		});
	};

	const updateAnimationIndex = (index: number) => {
		setAnimationState((prev) => ({
			...prev,
			currentSowingIndex: index,
			lastSownIndex: prev.currentSowingIndex,
		}));
	};

	const stopAnimation = () => {
		setAnimationState({
			isAnimating: false,
			currentSowingIndex: null,
			animationDirection: "counterclockwise",
			lastSownIndex: null,
		});
	};

	return {
		animationState,
		startAnimation,
		updateAnimationIndex,
		stopAnimation,
	};
};
    