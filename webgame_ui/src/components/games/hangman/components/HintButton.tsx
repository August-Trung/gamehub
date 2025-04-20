import React from "react";

interface HintButtonProps {
	hintsRemaining: number;
	onRequestHint: () => void;
	disabled: boolean;
}

const HintButton: React.FC<HintButtonProps> = ({
	hintsRemaining,
	onRequestHint,
	disabled,
}) => {
	return (
		<button
			onClick={onRequestHint}
			disabled={disabled}
			className={`
        flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium
        ${
			disabled
				? "bg-gray-200 text-gray-500 cursor-not-allowed"
				: "bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
		}
      `}
			title={
				disabled && hintsRemaining <= 0
					? "No hints remaining"
					: "Get a hint"
			}>
			<span>💡</span>
			<span>
				{hintsRemaining > 0
					? `Use Hint (${hintsRemaining} left)`
					: "No hints left"}
			</span>
		</button>
	);
};

export default HintButton;
