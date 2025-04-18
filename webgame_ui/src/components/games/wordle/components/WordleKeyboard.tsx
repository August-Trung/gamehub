// src/components/games/wordle/components/WordleKeyboard.tsx
interface WordleKeyboardProps {
	keyboardStatus: Record<
		string,
		"correct" | "present" | "absent" | undefined
	>;
	onKeyPress: (key: string) => void;
}

export default function WordleKeyboard({
	keyboardStatus,
	onKeyPress,
}: WordleKeyboardProps) {
	const keyboard: string[][] = [
		["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
		["A", "S", "D", "F", "G", "H", "J", "K", "L"],
		["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
	];

	const getKeyColor = (key: string): string => {
		if (key === "Enter" || key === "Backspace") return "bg-gray-300";
		const status = keyboardStatus[key];
		if (status === "correct") return "bg-green-500 text-white";
		if (status === "present") return "bg-yellow-500 text-white";
		if (status === "absent") return "bg-gray-500 text-white";
		return "bg-gray-200";
	};

	return (
		<div className="keyboard">
			{keyboard.map((row, rowIndex) => (
				<div
					key={`kbrow-${rowIndex}`}
					className="flex justify-center mb-2">
					{row.map((key) => (
						<button
							key={`key-${key}`}
							className={`${
								key === "Enter" || key === "Backspace"
									? "px-3 text-sm"
									: "w-8"
							} h-10 mx-1 flex items-center justify-center font-medium rounded transition-colors duration-300 transform hover:scale-105 active:scale-95 ${getKeyColor(key)}`}
							onClick={() =>
								onKeyPress(
									key === "Backspace" ? "Backspace" : key
								)
							}>
							{key === "Backspace" ? "←" : key}
						</button>
					))}
				</div>
			))}
		</div>
	);
}
