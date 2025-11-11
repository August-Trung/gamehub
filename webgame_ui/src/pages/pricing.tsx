import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import DefaultLayout from "@/layouts/default";
import { useLanguage } from "@/contexts/LanguageContext";

type SupportTab = "bank";

const PRICING_COPY = {
	vi: {
		hero: {
			eyebrow: "Ủng hộ Game Hub",
			title: "Game web free 100% – chỉ mong bạn mời mình ly cà phê ☕",
			description:
				"Game Hub AT do một người phát triển, không quảng cáo, không paywall. Mỗi khoản ủng hộ giúp mình duy trì server, mua nhạc bản quyền và viết thêm tài liệu tiếng Việt cho cộng đồng.",
			note: "Không bắt buộc đâu nhé – nếu hầu bao đang “đầu tháng như cuối tháng” thì cứ chơi free, vui tay thì quay lại quét QR.",
		},
		buttons: {
			primary: "Mời cà phê ngay",
			secondary: "Gửi lời nhắn",
		},
		stats: [
			{ label: "Giờ chơi / tháng", value: "120h+" },
			{ label: "Mini-game đang chạy", value: "11 trò" },
			{ label: "Chi phí server", value: "~650k/tháng" },
		],
		perks: [
			"Toàn bộ mini-game miễn phí, không quảng cáo hay giới hạn lượt chơi.",
			"Lưu tiến trình trực tiếp trên trình duyệt, không cần đăng nhập.",
			"Luôn có trò mới mỗi tháng với giao diện thuần tiếng Việt.",
			"Ủng hộ = giúp mình mua cà phê, trả server và tiếp tục sáng tạo.",
		],
		donationOptions: [
			{
				label: "Một ly cà phê sữa đá",
				price: "50.000đ",
				desc: "Đủ năng lượng fix bug cả buổi sáng và viết changelog tử tế.",
			},
			{
				label: "Combo cà phê + bánh mì",
				price: "100.000đ",
				desc: "Mình sẽ dành trọn một tối để build tính năng bạn gợi ý.",
			},
			{
				label: "Gói tiếp sức cuối tuần",
				price: "Tuỳ tâm",
				desc: "Nhận lời cảm ơn riêng + tên trong trang credit (nếu bạn muốn).",
			},
		],
		roadmap: [
			{
				title: "Leaderboard realtime",
				eta: "Tháng 6/2025",
				desc: "Dùng Supabase + WebSocket để bạn và bạn bè so kè điểm số.",
			},
			{
				title: "Nhạc nền tuỳ chỉnh",
				eta: "Tháng 7/2025",
				desc: "Thêm soundpack synthwave + ambient nhẹ cho từng mini-game.",
			},
			{
				title: "Sự kiện cuối tuần",
				eta: "Tháng 8/2025",
				desc: "Tạo thử thách xoay tua, gắn badge và highlight cộng đồng.",
			},
		],
		faqs: [
			{
				question: "Ủng hộ bằng cách nào?",
				answer:
					"Mở app MB Bank (hoặc bất kỳ app ngân hàng nào có quét QR Napas), đưa camera vào mã bên dưới là xong.",
			},
			{
				question: "Có quyền lợi riêng cho người ủng hộ không?",
				answer:
					"Tất cả game vẫn miễn phí. Nhưng bạn sẽ được ưu tiên phản hồi góp ý và xuất hiện ở bảng cảm ơn (nếu đồng ý).",
			},
			{
				question: "Có thể đóng góp code thay vì tiền?",
				answer:
					"Quá tuyệt! Gửi PR mini-game mới, nâng cấp UI/UX hoặc bổ sung tài liệu – mình luôn mở cửa collaborate.",
			},
		],
		support: {
			tabs: [
				{
					id: "bank" as SupportTab,
					label: "QR MB Bank",
					mood: "Chuyển khoản chuẩn chỉnh trong 5 giây",
				},
			],
			info: {
				bank: {
					title: "QR MB Bank chính chủ",
					desc: "Dù bạn dùng MB Bank, VCB, Techcombank hay Momo, chỉ cần chọn quét QR và lia camera vào là ra đúng thông tin.",
					account: "0000865706803",
					holder: "NGUYEN MINH TRUNG",
					note: "Ung ho Game Hub + Nickname",
					image: "/Bank.jpg",
					footer: "Nếu cần xác nhận/hoá đơn, cứ nhắn mình qua Discord hoặc email.",
				},
			},
		},
		messages: {
			copyIdle: "Sao chép nội dung ủng hộ",
			copySuccess: "Đã copy! Cảm ơn 🙏",
			copyError: "Copy chưa được, thử lại nhé",
			copyUnsupported: "Trình duyệt không hỗ trợ copy",
		},
		contact: {
			heading: "Liên hệ nhanh",
			subheading:
				"Mình thường trả lời email trong 24h. Nếu cần gấp, hãy ghi rõ trong nội dung nha!",
			emailDescription:
				"Viết bất cứ điều gì: góp ý mini-game, ý tưởng hợp tác hoặc đơn giản là “Hi”.",
			links: [
				{
					label: "Gửi email",
					href: "mailto:hello@gamehub.dev?subject=Hello%20Game%20Hub",
					desc: "Mở email mặc định, mình sẽ trả lời trong 24h.",
				},
				{
					label: "Mở form góp ý",
					href: "https://forms.gle/support-gamehub",
					desc: "Điền nhanh nếu bạn muốn gửi feedback dài hơn.",
				},
			],
			footer: "Hoặc ping mình trên Discord: @gamehub_at",
		},
	},
	en: {
		hero: {
			eyebrow: "Support Game Hub",
			title: "Web games are 100% free — just buy me a coffee ☕",
			description:
				"Game Hub AT is a one-person project with zero ads or paywalls. Every donation keeps the servers up, licenses music, and funds Vietnamese documentation.",
			note: "No pressure—if your wallet is in “end-of-month mode”, just keep playing for free. Come back to this QR whenever you feel like tipping.",
		},
		buttons: {
			primary: "Buy me a coffee",
			secondary: "Send a message",
		},
		stats: [
			{ label: "Play hours / month", value: "120h+" },
			{ label: "Mini-games online", value: "11 games" },
			{ label: "Server cost", value: "~650k/month" },
		],
		perks: [
			"All mini-games are free with zero ads or paywalls.",
			"Progress is saved locally in your browser—no login needed.",
			"New drops every month with native Vietnamese-first UI.",
			"Donations fuel coffee, servers, and future experiments.",
		],
		donationOptions: [
			{
				label: "Iced milk coffee",
				price: "50,000₫",
				desc: "Fuels a whole morning of bug fixing and changelog writing.",
			},
			{
				label: "Coffee + bánh mì combo",
				price: "100,000₫",
				desc: "I’ll spend an entire evening building the feature you suggest.",
			},
			{
				label: "Weekend booster",
				price: "Pay what you want",
				desc: "Get a personal thank-you and a credit shout-out if you’d like.",
			},
		],
		roadmap: [
			{
				title: "Realtime leaderboard",
				eta: "June 2025",
				desc: "Supabase + WebSocket so you and friends can compete live.",
			},
			{
				title: "Custom soundtrack",
				eta: "July 2025",
				desc: "Adding synthwave & ambient packs for each mini-game.",
			},
			{
				title: "Weekend events",
				eta: "August 2025",
				desc: "Rotating challenges, badges, and community highlights.",
			},
		],
		faqs: [
			{
				question: "How do I donate?",
				answer:
					"Open MB Bank or any Napas QR-enabled banking app, point it at the code below, and everything autofills.",
			},
			{
				question: "Do supporters get special perks?",
				answer:
					"All games stay free, but supporters get priority replies and a mention in the thank-you board (if you agree).",
			},
			{
				question: "Can I contribute code instead?",
				answer:
					"Absolutely! Send PRs for new mini-games, UX polish, or docs. Collaborations are always welcome.",
			},
		],
		support: {
			tabs: [
				{
					id: "bank" as SupportTab,
					label: "MB Bank QR",
					mood: "Transfer-ready in five seconds",
				},
			],
			info: {
				bank: {
					title: "Official MB Bank QR",
					desc: "Use MB Bank, VCB, Techcombank, Momo or any Napas QR scanner—the info auto-fills correctly.",
					account: "0000865706803",
					holder: "NGUYEN MINH TRUNG",
					note: "Ung ho Game Hub + Nickname",
					image: "/Bank.jpg",
					footer:
						"Need an invoice or confirmation? DM me on Discord or send an email.",
				},
			},
		},
		messages: {
			copyIdle: "Copy donation note",
			copySuccess: "Copied! Thank you 🙏",
			copyError: "Couldn't copy, please try again",
			copyUnsupported: "Browser does not support clipboard",
		},
		contact: {
			heading: "Quick contact",
			subheading:
				"I usually reply within 24 hours. Mention if it’s urgent!",
			emailDescription:
				"Send feedback, collaborations, or just say hi — everything is welcome.",
			links: [
				{
					label: "Open default mail app",
					href: "mailto:hello@gamehub.dev?subject=Hello%20Game%20Hub",
					desc: "Your message goes straight to my inbox.",
				},
				{
					label: "Open feedback form",
					href: "https://forms.gle/support-gamehub",
					desc: "Use this if you need more space to explain an idea.",
				},
			],
			footer: "Or ping me on Discord: @gamehub_at",
		},
	},
} as const;

export default function PricingPage() {
	const { language } = useLanguage();
	const copy = useMemo(() => PRICING_COPY[language], [language]);

	const [activeSupportTab, setActiveSupportTab] =
		useState<SupportTab>("bank");
	const [copyLabel, setCopyLabel] = useState<string>(copy.messages.copyIdle);
	const [isContactOpen, setIsContactOpen] = useState(false);

	useEffect(() => {
		setCopyLabel(copy.messages.copyIdle);
	}, [copy.messages.copyIdle]);

	const currentSupport = copy.support.info[activeSupportTab];

	const handleCopyNote = async () => {
		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(currentSupport.note);
				setCopyLabel(copy.messages.copySuccess);
			} else {
				setCopyLabel(copy.messages.copyUnsupported);
			}
		} catch (error) {
			setCopyLabel(copy.messages.copyError);
		} finally {
			setTimeout(() => setCopyLabel(copy.messages.copyIdle), 2500);
		}
	};

	const handleFocusSupport = (tab: SupportTab) => {
		setActiveSupportTab(tab);
		document
			.getElementById("support-card")
			?.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(() => {
		if (isContactOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [isContactOpen]);

	return (
		<DefaultLayout>
			<div className="space-y-12 text-white">
				<section className="space-y-5 text-center">
					<p className="text-xs uppercase tracking-[0.5em] text-cyan-200">
						{copy.hero.eyebrow}
					</p>
					<h1 className="text-4xl font-bold">{copy.hero.title}</h1>
					<p className="text-lg text-white/70 max-w-3xl mx-auto">
						{copy.hero.description}
					</p>
					<p className="text-base text-white/50 max-w-2xl mx-auto">
						{copy.hero.note}
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<button
							onClick={() => handleFocusSupport("bank")}
							className="rounded-full bg-cyan-400 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-slate-950 hover:bg-cyan-300">
							{copy.buttons.primary}
						</button>
						<button
							onClick={() => setIsContactOpen(true)}
							className="rounded-full border border-white/30 px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em] text-white/70 hover:border-white/60">
							{copy.buttons.secondary}
						</button>
					</div>
				</section>

				<section className="grid gap-4 sm:grid-cols-3">
					{copy.stats.map((stat) => (
						<div
							key={stat.label}
							className="rounded-3xl border border-white/10 bg-white/5 p-5 text-center">
							<p className="text-3xl font-bold text-cyan-300">
								{stat.value}
							</p>
							<p className="mt-2 text-xs uppercase tracking-[0.4em] text-white/60">
								{stat.label}
							</p>
						</div>
					))}
				</section>

				<section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-8">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{language === "vi" ? "Gói duy nhất" : "The only tier"}
						</p>
						<h2 className="mt-3 text-3xl font-semibold">
							Free Forever
						</h2>
						<p className="mt-2 text-white/70">
							{language === "vi"
								? "Không thu phí, không paywall, không NFT."
								: "No fees, no paywall, no NFTs."}
						</p>
						<ul className="mt-6 space-y-4 text-left">
							{copy.perks.map((perk) => (
								<li
									key={perk}
									className="flex items-start gap-3 text-base text-white/80">
									<span className="mt-1 text-cyan-300">•</span>
									<span>{perk}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="rounded-3xl border border-white/10 bg-slate-950/60 p-8">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{language === "vi" ? "Biểu tượng cảm ơn" : "Thank-you menu"}
						</p>
						<h2 className="mt-3 text-2xl font-semibold">
							{language === "vi" ? "Ủng hộ tự nguyện" : "Voluntary support"}
						</h2>
						<div className="mt-6 space-y-4">
							{copy.donationOptions.map((option) => (
								<div
									key={option.label}
									className="rounded-2xl border border-white/10 bg-white/5 p-4">
									<div className="flex items-center justify-between">
										<p className="text-base font-semibold">
											{option.label}
										</p>
										<p className="text-sm text-cyan-300">
											{option.price}
										</p>
									</div>
									<p className="mt-2 text-sm text-white/70">
										{option.desc}
									</p>
								</div>
							))}
						</div>
						<button
							onClick={() => handleFocusSupport("bank")}
							className="mt-6 w-full rounded-full bg-white/10 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-white hover:bg-white/80 hover:text-slate-900">
							{language === "vi"
								? "Đến khu vực QR"
								: "Scroll to QR"}
						</button>
					</div>
				</section>

				<section className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-950/80 via-slate-900/50 to-cyan-500/10 p-8">
					<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
						{language === "vi"
							? "Roadmap sử dụng kinh phí"
							: "How the funds are used"}
					</p>
					<div className="mt-6 grid gap-6 md:grid-cols-3">
						{copy.roadmap.map((item) => (
							<div
								key={item.title}
								className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<p className="text-sm uppercase tracking-[0.3em] text-cyan-200">
									{item.eta}
								</p>
								<h3 className="mt-2 text-xl font-semibold">
									{item.title}
								</h3>
								<p className="mt-2 text-sm text-white/70">
									{item.desc}
								</p>
							</div>
						))}
					</div>
				</section>

				<section className="grid gap-6 lg:grid-cols-2">
					<div className="rounded-3xl border border-white/10 bg-white/5 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{language === "vi" ? "Câu hỏi thường gặp" : "FAQ"}
						</p>
						<div className="mt-4 space-y-4">
							{copy.faqs.map((faq) => (
								<div
									key={faq.question}
									className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
									<p className="text-base font-semibold">
										{faq.question}
									</p>
									<p className="mt-2 text-sm text-white/70">
										{faq.answer}
									</p>
								</div>
							))}
						</div>
					</div>

					<div
						id="support-card"
						className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
						<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
							{language === "vi"
								? "Khu vực QR thần thánh"
								: "Magic QR corner"}
						</p>
						<div className="mt-4 flex flex-wrap gap-2">
							{copy.support.tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveSupportTab(tab.id)}
									className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
										activeSupportTab === tab.id
											? "border-cyan-300 bg-cyan-400/20 text-cyan-100"
											: "border-white/15 bg-white/5 text-white/60 hover:border-white/40"
									}`}>
									{tab.label}
								</button>
							))}
						</div>
						<p className="mt-3 text-sm text-white/60">
							{
								copy.support.tabs.find(
									(tab) => tab.id === activeSupportTab,
								)?.mood
							}
						</p>

						<div className="mt-4 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
							<div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
								<p className="text-xs uppercase tracking-[0.3em] text-cyan-200">
									{currentSupport.title}
								</p>
								<p className="mt-2 text-base text-white">
									{currentSupport.desc}
								</p>
								<div className="mt-4 space-y-2">
									<p>
										<span className="text-white/50">
											{language === "vi"
												? "Tài khoản:"
												: "Account:"}
										</span>{" "}
										<span className="font-semibold text-white">
											{currentSupport.account}
										</span>
									</p>
									<p>
										<span className="text-white/50">
											{language === "vi"
												? "Chủ tài khoản:"
												: "Holder:"}
										</span>{" "}
										<span className="font-semibold text-white">
											{currentSupport.holder}
										</span>
									</p>
									<p>
										<span className="text-white/50">
											{language === "vi"
												? "Nội dung gợi ý:"
												: "Suggested note:"}
										</span>{" "}
										<span className="font-semibold text-white">
											{currentSupport.note}
										</span>
									</p>
								</div>
								<button
									onClick={handleCopyNote}
									className="mt-4 w-full rounded-xl border border-white/20 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white hover:border-white">
									{copyLabel}
								</button>
								<p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/40">
									{currentSupport.footer}
								</p>
							</div>

							<div className="rounded-2xl border border-white/10 bg-white/5 p-4">
								<img
									src={currentSupport.image}
									alt={`QR ${currentSupport.title}`}
									className="w-full rounded-xl object-contain"
								/>
								<p className="mt-2 text-center text-sm text-white/70">
									{language === "vi"
										? "QR MB Bank chính hiệu: quét xong quay lại phá đảo thêm vài mini-game nhé!"
										: "Official MB Bank QR: scan it, then come back to beat more mini-games!"}
								</p>
							</div>
						</div>
						<p className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-white/50">
							{language === "vi"
								? "Trạng thái caffein hiện tại: 37% (đang cần tiếp lực 🔋)"
								: "Caffeine level: 37% (needs a recharge 🔋)"}
						</p>
					</div>
				</section>

				{isContactOpen &&
					typeof document !== "undefined" &&
					createPortal(
						<div className="fixed inset-0 z-40 flex items-center justify-center px-4 py-8">
							<div
								className="absolute inset-0 bg-black/70"
								onClick={() => setIsContactOpen(false)}
							/>
							<div className="relative z-50 w-full max-w-lg">
								<div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-cyan-400/40 via-transparent to-blue-500/30 blur-2xl opacity-70" />
								<div className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-950/95 p-6 shadow-[0_25px_90px_rgba(2,8,23,0.85)] backdrop-blur-2xl">
									<div className="flex items-start justify-between">
										<div>
											<p className="text-xs uppercase tracking-[0.4em] text-cyan-200">
												{copy.contact.heading}
											</p>
											<h3 className="text-2xl font-semibold mt-2">
												{language === "vi"
													? "Gửi lời nhắn cho mình"
													: "Send me a message"}
											</h3>
											<p className="mt-2 text-sm text-white/70">
												{copy.contact.subheading}
											</p>
										</div>
										<button
											className="text-white/70 hover:text-white text-lg"
											aria-label={
												language === "vi"
													? "Đóng"
													: "Close"
											}
											onClick={() => setIsContactOpen(false)}>
											×
										</button>
									</div>
									<div className="mt-6 space-y-4">
										<div className="rounded-2xl border border-white/30 bg-slate-900/70 p-5 shadow-[0_12px_32px_rgba(8,47,73,0.45)]">
											<p className="text-xs uppercase tracking-[0.3em] text-white/50">
												Email
											</p>
											<a
												href="mailto:hello@gamehub.dev?subject=Hello%20Game%20Hub"
												className="mt-1 inline-flex items-center gap-2 text-white font-semibold hover:text-cyan-300">
												hello@gamehub.dev
											</a>
											<p className="text-xs text-white/60 mt-1">
												{copy.contact.emailDescription}
											</p>
										</div>
										{copy.contact.links.map((link) => (
											<a
												key={link.label}
												href={link.href}
												target={
													link.href.startsWith("http")
														? "_blank"
														: undefined
												}
												rel={
													link.href.startsWith("http")
														? "noreferrer"
														: undefined
												}
												className="flex flex-col gap-1 rounded-xl border border-white/15 bg-white/10 p-4 hover:border-cyan-300 hover:bg-white/20 transition">
												<span className="text-sm font-semibold text-white">
													{link.label}
												</span>
												<span className="text-xs text-white/60">
													{link.desc}
												</span>
											</a>
										))}
									</div>
									<p className="mt-6 text-center text-xs uppercase tracking-[0.3em] text-white/40">
										{copy.contact.footer}
									</p>
								</div>
							</div>
						</div>,
						document.body,
					)}
			</div>
		</DefaultLayout>
	);
}
