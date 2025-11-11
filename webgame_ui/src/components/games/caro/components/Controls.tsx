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
			<button className="w-full caro-button" onClick={onRestart}>
				New Game
			</button>

			<div className="caro-board-size">
				<label className="block mb-2 text-sm tracking-[0.3em] uppercase text-slate-300">
					Board Size
				</label>
				<div className="grid grid-cols-3 gap-2">
					{[10, 15, 19].map((size) => {
						const active = boardSize === size;
						return (
							<button
								key={size}
								className={`py-2 px-1 text-center border ${active ? "active" : ""}`}
								onClick={() => onBoardSizeChange(size)}>
								{size}×{size}
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default Controls;
