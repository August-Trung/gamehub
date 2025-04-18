// src/components/layout/Footer.tsx
export default function Footer() {
	return (
		<footer className="bg-gray-800 text-white p-4 mt-auto">
			<div className="container mx-auto text-center">
				<p>
					&copy; {new Date().getFullYear()} Game Hub - All games for
					entertainment purposes
				</p>
			</div>
		</footer>
	);
}
