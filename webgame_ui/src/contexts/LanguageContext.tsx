import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

export type Language = "vi" | "en";

interface LanguageContextValue {
	language: Language;
	setLanguage: (lang: Language) => void;
	toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
	undefined,
);

const STORAGE_KEY = "gamehub_language";

export function LanguageProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [language, setLanguageState] = useState<Language>(() => {
		if (typeof window === "undefined") {
			return "vi";
		}
		const stored = window.localStorage.getItem(STORAGE_KEY);
		return stored === "en" || stored === "vi" ? stored : "vi";
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.localStorage.setItem(STORAGE_KEY, language);
		}
	}, [language]);

	const setLanguage = useCallback((lang: Language) => {
		setLanguageState(lang);
	}, []);

	const toggleLanguage = useCallback(() => {
		setLanguageState((prev) => (prev === "vi" ? "en" : "vi"));
	}, []);

	const value = useMemo(
		() => ({
			language,
			setLanguage,
			toggleLanguage,
		}),
		[language, setLanguage, toggleLanguage],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage(): LanguageContextValue {
	const context = useContext(LanguageContext);
	if (!context) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}
