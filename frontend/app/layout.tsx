import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CHITRA - Content Transformation Platform',
  description: 'Threat Advisory & Presentation Deck Synthesis System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..800&family=Geist:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Poppins:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans bg-[#FEEAEA] text-[#1E293B] min-h-screen selection:bg-[#7A3E48] selection:text-white">
        {children}
      </body>
    </html>
  );
}
