import { addToast } from "@heroui/react";

export const showSuccessToast = (message: string) => {
	addToast({
		title: "Success",
		description: message,
		color: "success",
		timeout: 3000,
		shouldShowTimeoutProgress: true,
	});
};

export const showErrorToast = (message: string) => {
	addToast({
		title: "Error",
		description: message,
		color: "danger",
		timeout: 3000,
		shouldShowTimeoutProgress: true,
	});
};

export const showWarningToast = (message: string) => {
	addToast({
		title: "Warning",
		description: message,
		color: "warning",
		timeout: 3000,
		shouldShowTimeoutProgress: true,
	});
};
