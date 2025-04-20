import React from "react";

interface CategorySelectorProps {
	categories: string[];
	selectedCategory: string;
	onSelectCategory: (category: string) => void;
	disabled?: boolean;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
	categories,
	selectedCategory,
	onSelectCategory,
	disabled = false,
}) => {
	return (
		<div className="flex flex-col items-center">
			<label
				htmlFor="category-select"
				className="mb-2 font-semibold text-gray-700">
				Choose a category:
			</label>
			<div className="relative w-full max-w-xs">
				<select
					id="category-select"
					value={selectedCategory}
					onChange={(e) => onSelectCategory(e.target.value)}
					disabled={disabled}
					className={`block appearance-none w-full bg-white border border-gray-300 
            hover:border-gray-400 px-4 py-2 pr-8 rounded-lg shadow-sm 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            ${disabled ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
					<svg
						className="fill-current h-4 w-4"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20">
						<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
					</svg>
				</div>
			</div>
			{disabled && (
				<p className="text-xs text-gray-500 mt-1">
					Finish the current game to change categories
				</p>
			)}
		</div>
	);
};

export default CategorySelector;
