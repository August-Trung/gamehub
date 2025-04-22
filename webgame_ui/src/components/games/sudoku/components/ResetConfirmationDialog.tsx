import React from "react";

interface ResetConfirmationDialogProps {
	isOpen: boolean;
	onConfirm: () => void;
	onCancel: () => void;
	progress: number;
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({
	isOpen,
	onConfirm,
	onCancel,
	progress,
}) => {
	if (!isOpen) return null;

	// Chỉ hiển thị thông tin tiến độ nếu progress > 25%
	const showProgressWarning = progress > 25;

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
			style={{ margin: "auto" }}>
			<div className="bg-white rounded-lg shadow-lg w-full max-w-xs sm:max-w-sm overflow-hidden">
				<div className="p-4">
					<h3 className="text-lg font-semibold mb-2">Reset Game?</h3>

					{showProgressWarning && (
						<p className="mb-2 text-sm">
							<span
								className={
									progress > 75
										? "text-red-600 font-medium"
										: ""
								}>
								{progress}% completed
							</span>
						</p>
					)}

					<p className="text-sm text-gray-700">
						This will clear all your entries and notes, but keep the
						original puzzle.
					</p>
				</div>

				<div className="flex border-t border-gray-200">
					<button
						className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium transition-colors border-r border-gray-200"
						onClick={onCancel}>
						Cancel
					</button>
					<button
						className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
						onClick={onConfirm}>
						Reset Game
					</button>
				</div>
			</div>
		</div>
	);
};

export default ResetConfirmationDialog;
