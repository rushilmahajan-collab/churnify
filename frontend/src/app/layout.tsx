import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RetainIQ - Retention Intelligence Dashboard',
  description: 'Connect Stripe. See who\'s at risk. Save them.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
