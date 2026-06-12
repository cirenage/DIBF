
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeaturedStoryProps {
  story?: any;
}

export function FeaturedStory({ story }: FeaturedStoryProps) {
  if (!story) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl"
          >
            <Image 
              src={story.imageUrl || "https://picsum.photos/seed/featured-story/800/600"} 
              alt={story.title} 
              fill 
              className="object-cover"
              data-ai-hint="african community"
            />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <span className="text-primary font-bold uppercase tracking-widest text-xs">Featured Story</span>
              <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
                {story.title}
              </h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {story.summary || story.excerpt}
            </p>
            <Link 
              href={`/impact`}
              className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all group"
            >
              Read the full story <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
