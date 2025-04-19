// components/TetrisCell.tsx
import React from "react";

// Cell types correspond to tetromino types (plus empty)
export type CellType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface TetrisCellProps {
	type: CellType;
}

const TetrisCell: React.FC<TetrisCellProps> = ({ type }) => {
	// Color mapping for different tetromino types
	const colorClass = {
		0: "cell-empty",
		1: "cell-I", // I piece - cyan
		2: "cell-J", // J piece - blue
		3: "cell-L", // L piece - orange
		4: "cell-O", // O piece - yellow
		5: "cell-S", // S piece - green
		6: "cell-T", // T piece - purple
		7: "cell-Z", // Z piece - red
	}[type];

	return <div className={`tetris-cell ${colorClass}`} />;
};

export default TetrisCell;
