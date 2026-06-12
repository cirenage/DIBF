
"use client";

import * as React from 'react';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, limit } from 'firebase/firestore';
import { AnimatedHero } from '@/components/shared/AnimatedHero';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Target, Eye } from 'lucide-react';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';

export default function HomePage() {
  const db = useFirestore();

  // Hero Data
  const heroRef = useMemoFirebase(() => db ? doc(db, 'heroSections', 'home') : null, [db]);
  const { data: hero } = useDoc(heroRef);

  // Initiatives
  const initiativesQuery = useMemoFirebase(() => db ? query(collection(db, 'initiatives'), where('featured', '==', true), limit(3)) : null, [db]);
  const { data: initiatives } = useCollection(initiativesQuery);

  return (
    <div className="space-y-0">
      <AnimatedHero 
        eyebrow={hero?.eyebrow || "Healing Communities. Empowering Futures."}
        heading={hero?.heading || "Advancing Health, Human Dignity, and Sustainable Development"}
        body={hero?.body || "DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to health equity and sustainable development across Africa."}
        imageUrl={hero?.imageUrl || "https://picsum.photos/seed/dibf-hero/1920/1080"}
        primaryCTA={hero?.primaryCTA || "Get Involved"}
        primaryLink={hero?.primaryLink || "/get-involved"}
        secondaryCTA={hero?.secondaryCTA || "Learn More"}
        secondaryLink={hero?.secondaryLink || "/about"}
      />

      {/* Stats Section */}
      <section className="py-12 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <RevealItem>
              <p className="text-3xl md:text-5xl font-bold text-accent">15K+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Lives Impacted</p>
            </RevealItem>
            <RevealItem>
              <p className="text-3xl md:text-5xl font-bold text-accent">45+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Community Clinics</p>
            </RevealItem>
            <RevealItem>
              <p className="text-3xl md:text-5xl font-bold text-accent">12+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Regional Projects</p>
            </RevealItem>
            <RevealItem>
              <p className="text-3xl md:text-5xl font-bold text-accent">80+</p>
              <p className="text-sm text-white/70 mt-1 uppercase tracking-wider">Partners</p>
            </RevealItem>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader 
              title="A Purpose-Driven Foundation" 
              subtitle="DIBF advances health equity, strengthens community wellbeing, and supports sustainable development across Africa and underserved communities globally."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
            <Card className="border-none shadow-xl overflow-hidden group">
              <CardContent className="p-10 space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-secondary">Our Mission</h3>
                <p className="text-lg text-secondary/80 leading-relaxed italic">
                  “To create sustainable pathways for people, institutions, and communities to improve lives, improve healthcare, and advance human dignity through service, partnership, innovation, and purposeful giving.”
                </p>
              </CardContent>
              <div className="h-2 w-full bg-primary" />
            </Card>

            <Card className="border-none shadow-xl overflow-hidden group">
              <CardContent className="p-10 space-y-6">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                  <Eye className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-secondary">Our Vision</h3>
                <p className="text-lg text-secondary/80 leading-relaxed italic">
                  “A world where every person, institution, and community has a meaningful pathway to create lasting impact, and where Africa’s challenges inspire global collaboration, innovation, and shared responsibility.”
                </p>
              </CardContent>
              <div className="h-2 w-full bg-accent" />
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Initiatives */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader 
              title="Programs That Transform Communities" 
              subtitle="Scaling impact through targeted, sustainable programs that address critical needs."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {initiatives.map((item, idx) => (
              <RevealItem key={item.id || idx}>
                <Card className="h-full border-none shadow-lg group hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image 
                      src={item.imageUrl || "https://picsum.photos/seed/dibf-init/600/400"} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-primary hover:bg-white">{item.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex-1">
                    <h3 className="text-xl font-bold mb-3 text-secondary">{item.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{item.summary}</p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button asChild variant="link" className="p-0 text-primary gap-2 font-bold">
                      <Link href="/initiatives">Learn more <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              </RevealItem>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-20 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/20 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold font-headline">Ready to be part of the change?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-body">
            Your involvement helps us advance health, human dignity, and sustainable development across Africa.
          </p>
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
