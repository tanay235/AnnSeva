import './globals.css';

export const metadata = {
  title: 'ClearStock — Turn Expiring Inventory into Revenue',
  description:
    'ClearStock is a smart B2B liquidation platform that connects manufacturers and distributors with wholesalers — recovering value from surplus and near-expiry packaged stock.',
  keywords: 'B2B liquidation, surplus inventory, wholesale, fast moving consumer goods, FMCG, ClearStock',
  openGraph: {
    title: 'ClearStock — Turn Expiring Inventory into Revenue',
    description:
      'Smart B2B liquidation platform connecting surplus inventory with wholesale buyers.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
