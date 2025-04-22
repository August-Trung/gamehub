// useTimer.ts - Giải pháp đơn giản hóa
import { useState, useEffect, useCallback } from "react";

export interface TimerConfig {
	initialTime: number; // Thời gian ban đầu tính bằng giây
	timeIncrement: number; // Thời gian được thêm sau mỗi lượt (không sử dụng trong phiên bản này)
}

export const useTimer = (config: TimerConfig) => {
	const [timeX, setTimeX] = useState(config.initialTime);
	const [timeO, setTimeO] = useState(config.initialTime);
	const [activePlayer, setActivePlayer] = useState<"X" | "O" | null>("X");
	const [isRunning, setIsRunning] = useState(false);

	// Định dạng thời gian thành mm:ss
	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Bắt đầu đồng hồ
	const startTimer = useCallback(() => {
		setIsRunning(true);
	}, []);

	// Dừng đồng hồ
	const stopTimer = useCallback(() => {
		setIsRunning(false);
	}, []);

	// Chuyển lượt chơi - ĐƠN GIẢN CHỈ LÀ CHUYỂN NGƯỜI CHƠI
	const switchPlayer = useCallback((nextPlayer: "X" | "O") => {
		// Chỉ đơn giản chuyển người chơi
		setActivePlayer(nextPlayer);
	}, []);

	// Reset đồng hồ
	const resetTimer = useCallback(() => {
		setTimeX(config.initialTime);
		setTimeO(config.initialTime);
		setActivePlayer("X");
		setIsRunning(false);
	}, [config.initialTime]);

	// Đếm ngược thời gian
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isRunning && activePlayer) {
			interval = setInterval(() => {
				if (activePlayer === "X") {
					setTimeX((prev) => {
						if (prev <= 0) {
							if (interval) clearInterval(interval);
							setIsRunning(false);
							return 0;
						}
						return prev - 1;
					});
				} else {
					setTimeO((prev) => {
						if (prev <= 0) {
							if (interval) clearInterval(interval);
							setIsRunning(false);
							return 0;
						}
						return prev - 1;
					});
				}
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isRunning, activePlayer]);

	return {
		timeX,
		timeO,
		activePlayer,
		isRunning,
		formattedTimeX: formatTime(timeX),
		formattedTimeO: formatTime(timeO),
		startTimer,
		stopTimer,
		switchPlayer,
		resetTimer,
		hasTimeOut: timeX <= 0 || timeO <= 0,
		timeOutPlayer: timeX <= 0 ? "X" : timeO <= 0 ? "O" : null,
	};
};
