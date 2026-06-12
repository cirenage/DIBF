
"use client";

import * as React from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { AnimatedHero } from '@/components/shared/AnimatedHero';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { RevealItem } from '@/components/shared/ScrollReveal';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function InitiativesPage() {
  const db = useFirestore();
  const initiativesQuery = useMemoFirebase(() => db ? query(collection(db, 'initiatives'), orderBy('order', 'asc')) : null, [db]);
  const { data: initiatives, loading } = useCollection(initiativesQuery);

  return (
    <div className="min-h-screen">
      <AnimatedHero 
        eyebrow="Our Initiatives"
        heading="Programs That Transform Communities"
        body="Our flagship initiatives are designed to create lasting impact by addressing healthcare, education, youth empowerment, and community development."
        imageUrl="https://picsum.photos/seed/dibf-initiatives/1920/1080"
        primaryCTA="View Projects"
        primaryLink="#projects"
      />

      <section id="projects" className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Flagship Programs" 
            subtitle="Scaling impact through targeted, sustainable programs that address critical needs across Africa."
          />
          
          <div className="space-y-20">
            {initiatives.map((item, idx) => (
              <RevealItem key={item.id} className={cn("grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", idx % 2 === 1 && "lg:flex-row-reverse")}>
                <div className={cn("space-y-8", idx % 2 === 1 && "lg:order-2")}>
                  <div className="space-y-4">
                    <span className="text-primary font-bold uppercase tracking-widest text-sm">{item.category}</span>
                    <h3 className="text-3xl md:text-4xl font-bold text-secondary font-headline">{item.title}</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                  
                  {item.bullets && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {item.bullets.map((bullet: string, i: number) => (
                        <div key={i} className="flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                          <span className="text-secondary font-medium">{bullet}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button asChild className="h-12 px-8 font-bold gap-2">
                    <Link href={`/initiatives/${item.slug}`}>
                      Learn More <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
                
                <div className={cn("relative h-[450px] rounded-3xl overflow-hidden shadow-2xl", idx % 2 === 1 && "lg:order-1")}>
                  <Image 
                    src={item.imageUrl || `https://picsum.photos/seed/${item.slug}/800/600`} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                  />
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold font-headline">Together, We Create Lasting Impact.</h2>
          <p className="text-lg text-white/80">Join us in building healthier, stronger, and more equitable communities across Africa.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="secondary" className="px-10 h-14 font-bold shadow-xl">
              <Link href="/get-involved">Get Involved</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-10 h-14 font-bold border-white text-white hover:bg-white/10">
              <Link href="/give">Make a Donation</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
