import "./global.css";

export const metadata = {
	title: "LSEG ChatBot",
	description: "This is my implementation of the LSEG ChatBot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body>{children}</body>
		</html>
	);
}
