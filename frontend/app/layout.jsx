import "./globals.css";

export const metadata = {
  title: "AnnSeva – Food Donation Platform",
  description: "Connect food donors with NGOs to reduce waste and feed communities.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
