import React from "react";

interface CellProps {
	value: number | null;
	isFixed: boolean;
	isValid: boolean;
	notes: number[];
	isSelected: boolean;
	isRelated: boolean;
	hasSameValue: boolean;
	borderClasses: string;
	onClick: () => void;
	onChange: (value: number | null) => void;
}

const Cell: React.FC<CellProps> = ({
	value,
	isFixed,
	isValid,
	notes,
	isSelected,
	isRelated,
	hasSameValue,
	borderClasses,
	onClick,
	onChange,
}) => {
	// Determine background color based on cell state
	let bgColor = "bg-white";
	if (isSelected) {
		bgColor = "bg-blue-200";
	} else if (hasSameValue && value !== null) {
		bgColor = "bg-blue-100";
	} else if (isRelated) {
		bgColor = "bg-gray-100";
	}

	// Add invalid state styling
	if (!isValid && value !== null) {
		bgColor = "bg-red-100";
	}

	// Determine text color and font weight
	const textColor = isFixed ? "text-black font-bold" : "text-blue-600";

	return (
		<div
			className={`${borderClasses} ${bgColor} flex items-center justify-center relative cursor-pointer transition-all`}
			onClick={onClick}>
			{value ? (
				<span
					className={`text-2xl ${textColor} ${!isValid ? "text-red-500" : ""}`}>
					{value}
				</span>
			) : (
				<div className="grid grid-cols-3 grid-rows-3 w-full h-full">
					{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
						<div
							key={num}
							className="flex items-center justify-center">
							{notes.includes(num) && (
								<span className="text-xs text-gray-500">
									{num}
								</span>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default Cell;
