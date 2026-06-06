
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AIBotAssistant } from '@/components/ai/AIBotAssistant';

export const metadata: Metadata = {
  title: 'Doctors in Business Foundation | DIBF',
  description: 'Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <AIBotAssistant />
        <Toaster />
      </body>
    </html>
  );
}
