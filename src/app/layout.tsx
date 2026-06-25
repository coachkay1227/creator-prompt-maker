import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Creator Prompt Maker',
  description: '4-tool AI prompt wizard for ChatGPT, Claude, Gemini and NotebookLM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className + ' bg-gray-950 text-white min-h-screen'}>
        {children}
      </body>
    </html>
  );
}
