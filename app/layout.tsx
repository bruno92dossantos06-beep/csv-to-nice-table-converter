import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DataConverter Pro | Convertisseur CSV vers Excel Gratuit',
  description: 'Convertissez vos fichiers CSV en tableaux lisibles et téléchargez-les en format Excel en un clic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}