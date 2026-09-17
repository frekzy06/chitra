import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHITRA // NITROUS ENGINE - Sovereign Content Transformation',
  description: '100% Air-Gapped Generative AI for Automated Threat Advisory & Slide Deck Synthesis',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FEEAEA] selection:bg-[#7A3E48] selection:text-white">
        {children}
      </body>
    </html>
  );
}
