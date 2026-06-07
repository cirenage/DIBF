
"use client";

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Heart, Database } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About DIBF' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/partnerships', label: 'Partnerships' },
  { href: '/contact', label: 'Contact' },
  { href: '/admin', label: 'Database', icon: Database },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-500 ease-in-out',
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm border-b py-2' 
        : 'bg-transparent py-4'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-lg text-white font-bold text-xl group-hover:scale-105 transition-transform duration-300">
            DIBF
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className={cn(
              "font-headline font-bold text-lg transition-colors duration-300",
              isScrolled ? "text-secondary" : "text-secondary"
            )}>
              Doctors in Business
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Foundation</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-all relative py-1 flex items-center gap-1.5",
                  isActive ? "text-primary font-bold" : "text-secondary/80 hover:text-primary"
                )}
              >
                {link.icon && <link.icon className="w-3.5 h-3.5" />}
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Link>
            );
          })}
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button asChild variant="default" className="ml-4 gap-2 px-6 shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                Give
              </Link>
            </Button>
          </motion.div>
        </nav>

        {/* Mobile Nav */}
        <div className="lg:hidden flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link href="/give">
              <Heart className="w-4 h-4" />
              Give
            </Link>
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left text-primary font-headline">DIBF Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-medium py-2 border-b border-muted transition-colors hover:text-primary flex items-center gap-2",
                      pathname === link.href ? "text-primary" : "text-secondary/80"
                    )}
                  >
                    {link.icon && <link.icon className="w-5 h-5" />}
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
