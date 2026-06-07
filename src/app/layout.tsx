"use client";

import './globals.css';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Toaster } from '@/components/ui/toaster';
import { AIBotAssistant } from '@/components/ai/AIBotAssistant';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { FirebaseClientProvider } from '@/firebase';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <title>Doctors in Business Foundation | DIBF</title>
        <meta name="description" content="Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community." />
      </head>
      <body className="font-body antialiased text-foreground selection:bg-primary/20">
        <FirebaseClientProvider>
          <Navbar />
          <AnimatePresence mode="wait">
            <motion.main
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="min-h-screen"
            >
              {children}
            </motion.main>
          </AnimatePresence>
          <Footer />
          <AIBotAssistant />
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
