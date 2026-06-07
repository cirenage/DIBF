import './globals.css';
import { ClientLayout } from '@/components/shared/ClientLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Doctors in Business Foundation | DIBF",
  description: "Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased text-foreground selection:bg-primary/20">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
