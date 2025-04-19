// components/NextPieceDisplay.tsx
import React from "react";
import TetrisCell from "./TetrisCell";
import { TetrominoType, TETROMINOS } from "../hooks/useTetrisGame";

interface NextPieceDisplayProps {
	piece: TetrominoType;
}

const NextPieceDisplay: React.FC<NextPieceDisplayProps> = ({ piece }) => {
	const shape = TETROMINOS[piece].shape;

	return (
		<div className="next-piece">
			{shape.map((row, rowIndex) => (
				<div key={rowIndex} className="next-piece-row">
					{row.map((cell, colIndex) => (
						<TetrisCell
							key={`${rowIndex}-${colIndex}`}
							type={cell ? piece : 0}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default NextPieceDisplay;
