
"use client";

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

interface HeroProps {
  data?: any;
}

export function Hero({ data }: HeroProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-secondary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data?.imageUrl || "https://picsum.photos/seed/dibf-hero-gate/1920/1080"}
          alt="DIBF Background"
          fill
          className="object-cover opacity-50"
          priority
          data-ai-hint="medical doctor children"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/40 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div 
          className="max-w-4xl space-y-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-accent font-bold uppercase tracking-[0.2em] text-sm block"
            >
              {data?.eyebrow || "Advancing Health. Human Dignity. Sustainable Development."}
            </motion.span>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] font-headline"
            >
              {data?.heading || "Creating Pathways. Transforming Lives. Building Stronger Communities."}
            </motion.h1>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl font-body"
          >
            {data?.body || "DIBF advances health equity, community wellbeing, youth empowerment, and sustainable development across Africa and underserved communities worldwide."}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl bg-accent hover:bg-accent/90 rounded-full transition-all">
              <Link href="/get-involved">
                Support Our Work
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white/30 text-white hover:bg-white/10 rounded-full transition-all gap-2">
              <Link href="/initiatives">
                Explore Initiatives <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle Indicators (Visual only) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
        <div className="w-8 h-1 bg-white rounded-full" />
        <div className="w-2 h-1 bg-white/30 rounded-full" />
        <div className="w-2 h-1 bg-white/30 rounded-full" />
      </div>
    </section>
  );
}
