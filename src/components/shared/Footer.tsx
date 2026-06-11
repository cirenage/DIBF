"use client";

import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Heart, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary text-white pt-20 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand & Purpose */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="bg-primary p-2 rounded-lg text-white font-bold text-xl">DIBF</div>
              <span className="font-bold text-xl">DIBF Global Impact</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community. 
              DIBF is the nonprofit arm of Doctors in Business Global.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Facebook className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Twitter className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Instagram className="w-4 h-4" /></Link>
              <Link href="#" className="p-2 bg-white/5 rounded-full hover:bg-primary transition-colors"><Linkedin className="w-4 h-4" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6 lg:pl-8">
            <h3 className="font-bold text-lg border-l-4 border-primary pl-3">Quick Links</h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About DIBF</Link></li>
              <li><Link href="/what-we-do" className="hover:text-accent transition-colors">What We Do</Link></li>
              <li><Link href="/initiatives" className="hover:text-accent transition-colors">Our Initiatives</Link></li>
              <li><Link href="/impact" className="hover:text-accent transition-colors">Impact Stories</Link></li>
              <li><Link href="/news" className="hover:text-accent transition-colors">News & Insights</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Initiatives & Programs */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-l-4 border-primary pl-3">Initiatives</h3>
            <ul className="space-y-3 text-white/60 text-sm">
              <li><Link href="/initiatives" className="hover:text-accent transition-colors">The Tinewonsa Project</Link></li>
              <li><Link href="/initiatives" className="hover:text-accent transition-colors">Dollar-A-Day Campaign</Link></li>
              <li><Link href="/initiatives" className="hover:text-accent transition-colors">African Field School</Link></li>
              <li><Link href="/impact-store" className="hover:text-accent transition-colors">DIBF Impact Store</Link></li>
              <li><Link href="/partnerships" className="hover:text-accent transition-colors">Global Partnerships</Link></li>
            </ul>
          </div>

          {/* Newsletter & Support */}
          <div className="space-y-6">
            <h3 className="font-bold text-lg border-l-4 border-primary pl-3">Get Updates</h3>
            <p className="text-xs text-white/50 italic">Join our community for impact updates and news.</p>
            <div className="flex gap-2">
              <Input placeholder="Email Address" className="bg-white/5 border-white/10 text-white" />
              <Button size="icon" className="shrink-0"><Send className="w-4 h-4" /></Button>
            </div>
            <Button asChild className="w-full gap-2 font-bold" variant="default">
              <Link href="/give">
                <Heart className="w-4 h-4 fill-current" />
                Support Our Mission
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs">
          <p>© {currentYear} Doctors in Business Foundation (DIBF). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Use</Link>
            <Link href="#" className="hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
