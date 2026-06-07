
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion, useReducedMotion } from 'framer-motion';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-medical');
  const fallbackUrl = "https://picsum.photos/seed/dibf-hero/1200/800";
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: shouldReduceMotion ? 1 : 1.1 }}
          animate={{ scale: shouldReduceMotion ? 1 : 1 }}
          transition={{ duration: 10, ease: "linear" }}
          className="relative h-full w-full"
        >
          <Image
            src={heroImage?.imageUrl || fallbackUrl}
            alt="DIBF Impact"
            fill
            className="object-cover"
            priority
            data-ai-hint="medical outreach"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            variants={itemVariants}
            className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full"
          >
            <span className="text-primary-foreground font-semibold text-sm tracking-wide uppercase">
              Healing Communities. Empowering Futures.
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-white leading-[1.1]"
          >
            Advancing <span className="text-primary italic">Health</span>, Human Dignity, and Sustainable Development.
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 font-body leading-relaxed max-w-2xl"
          >
            DIBF is the nonprofit and social impact arm of Doctors in Business Global, 
            dedicated to health equity, youth empowerment, and sustainable humanitarian interventions 
            across Africa and the global community.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:translate-y-[-2px] transition-all duration-300">
              <Link href="/give">Donate Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white hover:text-secondary hover:translate-y-[-2px] transition-all duration-300">
              <Link href="/partnerships">Partner With Us</Link>
            </Button>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10"
          >
            <div>
              <p className="text-3xl font-bold text-white">15K+</p>
              <p className="text-sm text-white/60">Lives Impacted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">45+</p>
              <p className="text-sm text-white/60">Community Clinics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12+</p>
              <p className="text-sm text-white/60">Regional Projects</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
