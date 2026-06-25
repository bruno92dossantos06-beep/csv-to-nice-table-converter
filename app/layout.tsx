import type { Metadata } from 'next';
import './globals.css';

export const metadata = {
  title: 'DataConverter Pro | Convertisseur CSV vers Excel Gratuit',
  description: 'Convertissez vos fichiers CSV en tableaux lisibles et téléchargez-les en format Excel en un clic. Outil gratuit et rapide.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}