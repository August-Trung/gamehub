// src/components/layout/Footer.tsx
import { useLanguage } from "@/contexts/LanguageContext";

const FOOTER_COPY = {
	vi: {
		headline: "Game Hub AT",
		subline: "Sân chơi mini-game build bởi cộng đồng dev Việt Nam.",
		links: [
			{ label: "GitHub", href: "https://github.com" },
			{ label: "Discord", href: "https://discord.com" },
			{ label: "Liên hệ", href: "mailto:team@gamehub.dev" },
		],
		tagline: "Chơi có trách nhiệm · Xây bằng React & Tailwind",
	},
	en: {
		headline: "Game Hub AT",
		subline: "Indie mini-game playground crafted by Vietnamese devs.",
		links: [
			{ label: "GitHub", href: "https://github.com" },
			{ label: "Discord", href: "https://discord.com" },
			{ label: "Contact", href: "mailto:team@gamehub.dev" },
		],
		tagline: "Play responsibly · Built with React & Tailwind",
	},
};

export default function Footer() {
	const { language } = useLanguage();
	const copy = FOOTER_COPY[language];

	return (
		<footer className="mt-16 border-t border-white/10 bg-slate-950/80 text-white">
			<div className="container mx-auto px-4 py-8 md:px-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div>
						<p className="text-lg font-semibold">{copy.headline}</p>
						<p className="text-sm text-white/60">{copy.subline}</p>
					</div>
					<div className="flex flex-wrap gap-4 text-sm text-white/70">
						{copy.links.map((link) => (
							<a
								key={link.label}
								href={link.href}
								target={link.href.startsWith("http") ? "_blank" : undefined}
								rel={link.href.startsWith("http") ? "noreferrer" : undefined}
								className="hover:text-white">
								{link.label}
							</a>
						))}
					</div>
				</div>
				<div className="mt-6 flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/40">
					<span>© {new Date().getFullYear()} Game Hub Collective</span>
					<span>{copy.tagline}</span>
				</div>
			</div>
		</footer>
	);
}
