import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DataConverter Pro | Convertisseur CSV vers Excel Gratuit',
  description: 'Transformez vos fichiers CSV en tableaux lisibles et exportez-les en format Excel (.xlsx) instantanément et gratuitement avec DataConverter Pro.',
  keywords: 'convertir CSV, CSV vers Excel, outil CSV en ligne, convertisseur gratuit, data converter',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="bg-slate-50">{children}</body>
    </html>
  );
}