// src/components/layout/Header.tsx
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
	currentGame: string | null;
	onBackToMenu: () => void;
}

const NAV_ITEMS = {
	vi: [
		{ label: "Sảnh chính", href: "/" },
		{ label: "Tài liệu", href: "/docs" },
		{ label: "Ủng hộ", href: "/pricing" },
		{ label: "Blog", href: "/blog" },
	],
	en: [
		{ label: "Lobby", href: "/" },
		{ label: "Docs", href: "/docs" },
		{ label: "Pricing", href: "/pricing" },
		{ label: "Blog", href: "/blog" },
	],
};

export default function Header({ currentGame, onBackToMenu }: HeaderProps) {
	const location = useLocation();
	const { language, toggleLanguage } = useLanguage();
	const navItems = NAV_ITEMS[language];

	return (
		<header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">
			<div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
				<Link to="/" className="flex items-center gap-3">
					<div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
						GH
					</div>
					<div className="leading-tight">
						<p className="text-lg font-semibold text-white">
							Game Hub
						</p>
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							Arcade AT
						</p>
					</div>
				</Link>

				<nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-white/70">
					{navItems.map((item) => {
						const isActive =
							location.pathname === item.href ||
							(item.href !== "/" &&
								location.pathname.startsWith(item.href));

						return (
							<Link
								key={item.href}
								to={item.href}
								className={`transition ${
									isActive
										? "text-cyan-300"
										: "hover:text-white"
								}`}>
								{item.label}
							</Link>
						);
					})}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						to="/about"
						className="hidden sm:inline-flex rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 hover:border-white/40">
						{language === "vi" ? "Về chúng tôi" : "About us"}
					</Link>
					<button
						onClick={toggleLanguage}
						className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-cyan-300">
						{language === "vi" ? "EN" : "VI"}
					</button>
					{currentGame && (
						<button
							onClick={onBackToMenu}
							className="rounded-full bg-white text-slate-900 px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] shadow-lg shadow-white/30 transition hover:bg-cyan-50">
							{language === "vi" ? "Thoát game" : "Exit game"}
						</button>
					)}
				</div>
			</div>
		</header>
	);
}
