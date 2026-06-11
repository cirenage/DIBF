
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Heart, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartDrawer } from '@/components/store/CartDrawer';
import { useCart } from '@/hooks/use-cart';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About DIBF' },
  { href: '/what-we-do', label: 'What We Do' },
  { href: '/initiatives', label: 'Initiatives' },
  { href: '/impact', label: 'Impact' },
  { href: '/partnerships', label: 'Partnerships' },
  { href: '/get-involved', label: 'Get Involved' },
  { href: '/news', label: 'News' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const cartCount = useCart((state) => state.totalItems());

  React.useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 w-full transition-all duration-300',
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-white py-4'
    )}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="bg-primary p-2 rounded-lg text-white font-bold text-xl transition-transform group-hover:scale-105">
            DIBF
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="font-bold text-secondary text-lg">Doctors in Business</span>
            <span className="text-xs text-muted-foreground uppercase tracking-widest">Foundation</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-semibold transition-colors nav-link-underline",
                  isActive ? "text-primary active font-bold" : "text-secondary/80 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          
          <div className="flex items-center gap-4 ml-4">
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative h-10 w-10">
                <ShoppingCart className="w-5 h-5 text-secondary" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>
            
            <Button asChild className="gap-2 px-6 font-bold shadow-md">
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                Donate
              </Link>
            </Button>
          </div>
        </nav>

        {/* Mobile Nav */}
        <div className="xl:hidden flex items-center gap-3">
          <CartDrawer>
            <Button variant="ghost" size="icon" className="relative h-9 w-9">
              <ShoppingCart className="w-4 h-4" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Button>
          </CartDrawer>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle className="text-left text-primary font-bold">Navigation</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 mt-8">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-lg font-bold py-3 border-b border-muted transition-colors",
                      pathname === link.href ? "text-primary" : "text-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild className="mt-6 gap-2 h-14 font-bold">
                  <Link href="/give">
                    <Heart className="w-4 h-4 fill-current" />
                    Make a Donation
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
