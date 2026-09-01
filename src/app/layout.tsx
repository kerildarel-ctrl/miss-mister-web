import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MISS MISTER — Votre vote, votre choix, votre champion',
  description: 'Plateforme web professionnelle de vote pour compétitions, concours de beauté, événements campus et élections. Tarif unique : 100 FCFA.',
  keywords: ['Miss Mister', 'Vote', 'Compétition', 'COPA AHN', 'COPA MSP LSI', 'Élection', 'Concours', '100 FCFA'],
  openGraph: {
    title: 'MISS MISTER — Plateforme de Vote',
    description: 'Votre vote, votre choix, votre champion. 100 FCFA le vote.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={poppins.variable}>
      <body className="min-h-screen flex flex-col font-poppins bg-[#F8FAFC] text-slate-900 selection:bg-blue-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}
