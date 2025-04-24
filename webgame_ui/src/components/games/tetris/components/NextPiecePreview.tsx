import { TETROMINOS, TETROMINO_COLORS } from "../constants/constants";
import { TetrominoType } from "../types/types";

interface NextPiecePreviewProps {
	piece: TetrominoType;
}

const NextPiecePreview: React.FC<NextPiecePreviewProps> = ({ piece }) => {
	const tetrominoValue = TETROMINOS[piece].value || 0;
	const color = TETROMINO_COLORS[tetrominoValue];

	return (
		<div className="next-piece-grid">
			{TETROMINOS[piece].shape.map((row: number[], y) => (
				<div key={y} className="next-piece-row">
					{row.map((cell, x) => (
						<div
							key={`${y}-${x}`}
							className="next-piece-cell"
							style={{
								backgroundColor: cell ? color : "transparent",
								borderColor: cell ? "#333" : "transparent",
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default NextPiecePreview;
