
'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Heart, ShoppingCart, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CartDrawer } from '@/components/store/CartDrawer';
import { useCart } from '@/hooks/use-cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NAV_GROUPS = [
  {
    label: 'About',
    items: [
      { href: '/about', label: 'Who We Are' },
      { href: '/about#mission', label: 'Mission & Vision' },
      { href: '/about#leadership', label: 'Leadership & Governance' },
    ]
  },
  {
    label: 'Our Work',
    items: [
      { href: '/what-we-do', label: 'Medical Outreach & Community Health' },
      { href: '/what-we-do', label: 'Public Health Education' },
      { href: '/what-we-do', label: 'Youth & Student Impact' },
      { href: '/what-we-do', label: 'Mental Health & Wellbeing' },
      { href: '/what-we-do', label: 'Sustainable Giving Initiatives' },
    ]
  },
  {
    label: 'Impact',
    items: [
      { href: '/impact', label: 'Stories of Impact' },
      { href: '/impact#reports', label: 'Outreach Reports' },
      { href: '/impact', label: 'Community Highlights' },
      { href: '/impact', label: 'Photo & Video Gallery' },
    ]
  },
  {
    label: 'Get Involved',
    items: [
      { href: '/get-involved', label: 'Volunteer' },
      { href: '/give', label: 'Donate' },
      { href: '/partnerships', label: 'Partner With Us' },
      { href: '/get-involved', label: 'Bring a Team' },
      { href: '/get-involved', label: 'Support a Campaign' },
	  { href: '/impact-store', label: 'Impact Store' },
    ]
  }
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
        <nav className="hidden xl:flex items-center gap-8">
          {NAV_GROUPS.map((group) => (
            <DropdownMenu key={group.label}>
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-secondary/80 hover:text-primary outline-none transition-colors">
                {group.label}
                <ChevronDown className="w-4 h-4 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 p-2 rounded-xl shadow-2xl border-muted">
                {group.items.map((item) => (
                  <DropdownMenuItem key={item.label} asChild>
                    <Link href={item.href} className="w-full cursor-pointer rounded-lg hover:bg-muted py-2.5 px-3 text-sm font-medium">
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          
          <div className="flex items-center gap-4 ml-4">
            <CartDrawer>
              <Button variant="ghost" size="icon" className="relative h-10 w-10 hover:bg-muted rounded-full">
                <ShoppingCart className="w-5 h-5 text-secondary" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50">
                    {cartCount}
                  </span>
                )}
              </Button>
            </CartDrawer>
            
            <Button asChild className="gap-2 px-8 h-12 rounded-full font-bold shadow-lg hover:scale-105 transition-transform">
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                Give
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
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle className="text-left text-primary font-bold">DIBF Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {NAV_GROUPS.map((group) => (
                  <div key={group.label} className="space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{group.label}</p>
                    <div className="flex flex-col gap-2 pl-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="text-sm font-semibold text-secondary hover:text-primary transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                <Button asChild className="mt-6 gap-2 h-14 font-bold rounded-xl">
                  <Link href="/give">
                    <Heart className="w-4 h-4 fill-current" />
                    Give
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
