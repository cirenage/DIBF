
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-lg text-white font-bold text-xl">
                DIBF
              </div>
              <span className="font-headline font-bold text-xl">DIBF Global Impact</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community. 
              DIBF is the nonprofit arm of Doctors in Business Global.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors"><Facebook className="w-5 h-5" /></Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors"><Twitter className="w-5 h-5" /></Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors"><Instagram className="w-5 h-5" /></Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-primary transition-colors"><Linkedin className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-lg border-l-4 border-primary pl-3">Quick Links</h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li><Link href="/about" className="hover:text-primary transition-colors">About DIBF</Link></li>
              <li><Link href="/what-we-do" className="hover:text-primary transition-colors">What We Do</Link></li>
              <li><Link href="/initiatives" className="hover:text-primary transition-colors">Our Initiatives</Link></li>
              <li><Link href="/impact" className="hover:text-primary transition-colors">Impact Stories</Link></li>
              <li><Link href="/news" className="hover:text-primary transition-colors">News & Insights</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Initiatives */}
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-lg border-l-4 border-primary pl-3">Initiatives</h3>
            <ul className="space-y-3 text-white/70 text-sm">
              <li><Link href="/initiatives#tinewonsa" className="hover:text-primary transition-colors">The Tinewonsa Project</Link></li>
              <li><Link href="/initiatives#dollar-a-day" className="hover:text-primary transition-colors">Dollar-A-Day Campaign</Link></li>
              <li><Link href="/initiatives#field-school" className="hover:text-primary transition-colors">DIB African Field School</Link></li>
              <li><Link href="/give" className="hover:text-primary transition-colors">Impact Store</Link></li>
              <li><Link href="/partnerships" className="hover:text-primary transition-colors">Collaborate With Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="font-headline font-bold text-lg border-l-4 border-primary pl-3">Connect</h3>
            <ul className="space-y-4 text-white/70 text-sm">
              <li className="flex gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>info@dibfglobal.org</span>
              </li>
              <li className="flex gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 000-0000</span>
              </li>
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>Global Headquarters, Africa Support Hub</span>
              </li>
            </ul>
            <Button asChild className="w-full gap-2 mt-4" variant="default">
              <Link href="/give">
                <Heart className="w-4 h-4" />
                Support Our Mission
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-white/50 text-xs">
          <p>© {currentYear} Doctors in Business Foundation | DIBF. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Accountability</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
