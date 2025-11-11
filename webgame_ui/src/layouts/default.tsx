import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function DefaultLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative min-h-screen bg-slate-950 text-white">
			<div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]" />
			<div className="relative flex min-h-screen flex-col">
				<Header currentGame={null} onBackToMenu={() => {}} />
				<main className="container mx-auto w-full flex-grow px-4 pb-16 pt-20 md:px-8 lg:px-12">
					<div className="rounded-3xl border border-white/5 bg-white/5 p-6 md:p-10 backdrop-blur-xl shadow-2xl shadow-black/40">
						{children}
					</div>
				</main>
				<Footer />
			</div>
		</div>
	);
}
