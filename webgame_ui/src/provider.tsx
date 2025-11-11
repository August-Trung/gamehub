import type { NavigateOptions } from "react-router-dom";

import { HeroUIProvider } from "@heroui/react";
import { useHref, useNavigate } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { ToastProvider } from "@heroui/toast";
import { LanguageProvider } from "@/contexts/LanguageContext";

declare module "@react-types/shared" {
	interface RouterConfig {
		routerOptions: NavigateOptions;
	}
}

export function Provider({ children }: { children: React.ReactNode }) {
	const navigate = useNavigate();

	return (
		<HeroUIProvider navigate={navigate} useHref={useHref}>
			<LanguageProvider>
				<ToastProvider />
				{children}
				<Analytics />
			</LanguageProvider>
		</HeroUIProvider>
	);
}
