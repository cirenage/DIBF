
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimatedHeroProps {
  eyebrow?: string;
  heading?: string;
  body?: string;
  imageUrl?: string;
  primaryCTA?: string;
  primaryLink?: string;
  secondaryCTA?: string;
  secondaryLink?: string;
  overlayOpacity?: number;
  className?: string;
}

export function AnimatedHero({
  eyebrow,
  heading,
  body,
  imageUrl,
  primaryCTA,
  primaryLink,
  secondaryCTA,
  secondaryLink,
  className
}: AnimatedHeroProps) {
  return (
    <section className={cn("relative min-h-[85vh] flex items-center overflow-hidden bg-secondary", className)}>
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imageUrl || "https://picsum.photos/seed/dibf-hero-bg/1920/1080"}
          alt="Hero Background"
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent z-[1]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl space-y-8">
          {eyebrow && (
            <div>
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest border border-accent/30 backdrop-blur-sm">
                {eyebrow}
              </span>
            </div>
          )}
          
          {heading && (
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-headline">
              {heading}
            </h1>
          )}
          
          {body && (
            <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-body">
              {body}
            </p>
          )}

          <div className="flex flex-wrap gap-4 pt-4">
            {primaryCTA && (
              <Button asChild size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
                <Link href={primaryLink || "/get-involved"}>
                  {primaryCTA}
                </Link>
              </Button>
            )}
            {secondaryCTA && (
              <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white text-white hover:bg-white/10 hover:scale-105 transition-all">
                <Link href={secondaryLink || "/about"}>
                  {secondaryCTA}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
