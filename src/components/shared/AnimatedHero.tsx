
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
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
  overlayOpacity = 0.6,
  className
}: AnimatedHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const [hasPlayed, setHasPlayed] = React.useState(true);

  React.useEffect(() => {
    // Check if animation has played in this session
    const played = sessionStorage.getItem('dibf_hero_animated');
    if (!played) {
      setHasPlayed(false);
      sessionStorage.setItem('dibf_hero_animated', 'true');
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: hasPlayed ? 0 : 0.5,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  const imageVariants = {
    hidden: { scale: shouldReduceMotion ? 1 : 1.05, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: hasPlayed ? 0.8 : 2, ease: "easeOut" }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0.7 },
    visible: {
      opacity: overlayOpacity,
      transition: { duration: hasPlayed ? 0.8 : 2, ease: "easeOut" }
    }
  };

  return (
    <section className={cn("relative min-h-[85vh] flex items-center overflow-hidden bg-secondary", className)}>
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={imageVariants}
          className="relative w-full h-full"
        >
          <Image
            src={imageUrl || "https://picsum.photos/seed/dibf-hero-bg/1920/1080"}
            alt="Hero Background"
            fill
            className="object-cover"
            priority
            data-ai-hint="medical outreach"
          />
        </motion.div>
        
        {/* Dynamic Overlay */}
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={overlayVariants}
          className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent z-[1]"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-4xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {eyebrow && (
            <motion.div variants={itemVariants}>
              <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest border border-accent/30 backdrop-blur-sm">
                {eyebrow}
              </span>
            </motion.div>
          )}
          
          {heading && (
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] font-headline"
            >
              {heading}
            </motion.h1>
          )}
          
          {body && (
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-body"
            >
              {body}
            </motion.p>
          )}

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
