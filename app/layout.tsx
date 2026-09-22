import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  title: '經絡穴位 3D 教學 · Meridian Atlas',
  description:
    '以三維人體圖譜認識中醫經絡穴位：了解什麼是穴位、如何取穴，以及壓力、失眠、水腫、小兒助長等都市人保健常用穴位。',
  manifest: '/manifest.webmanifest',
  icons: { icon: '/app-icon.svg' },
  appleWebApp: { capable: true, title: '經絡穴位3D', statusBarStyle: 'default' },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
