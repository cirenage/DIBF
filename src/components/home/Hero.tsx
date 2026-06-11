"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface HeroProps {
  data?: any;
}

export function Hero({ data }: HeroProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.21, 0.47, 0.32, 0.98] }
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-secondary">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data?.imageUrl || "https://picsum.photos/seed/dibf-hero-bg/1920/1080"}
          alt="DIBF Background"
          fill
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/70 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest border border-accent/30">
              {data?.eyebrow || "Healing Communities. Empowering Futures."}
            </span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1]"
          >
            {data?.heading || "Advancing Health, Human Dignity, and Sustainable Development"}
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg md:text-xl text-white/80 leading-relaxed max-w-2xl"
          >
            {data?.body || "DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to health equity and sustainable development across Africa."}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-10 text-lg font-bold shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
              <Link href={data?.primaryLink || "/get-involved"}>
                {data?.primaryCTA || "Get Involved"}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-10 text-lg font-bold border-white text-white hover:bg-white/10 hover:scale-105 transition-all">
              <Link href={data?.secondaryLink || "/about"}>
                {data?.secondaryCTA || "Learn More"}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}