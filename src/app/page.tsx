
"use client";

import * as React from 'react';
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, query, where, limit, orderBy } from 'firebase/firestore';
import { Hero } from '@/components/home/Hero';
import { FeaturedStory } from '@/components/home/FeaturedStory';
import { WhatWeDoGrid } from '@/components/home/WhatWeDoGrid';
import { ImpactStats } from '@/components/home/ImpactStats';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShoppingBag, Handshake, Heart, ShieldCheck } from 'lucide-react';

export default function HomePage() {
  const db = useFirestore();

  // Hero Data
  const heroRef = useMemoFirebase(() => db ? doc(db, 'heroSections', 'home') : null, [db]);
  const { data: hero } = useDoc(heroRef);

  // Featured Story (latest news or impact story)
  const storyQuery = useMemoFirebase(() => db ? query(collection(db, 'impactStories'), where('featured', '==', true), limit(1)) : null, [db]);
  const { data: featuredStories } = useCollection(storyQuery);
  const featuredStory = featuredStories?.[0];

  // Initiatives
  const initiativesQuery = useMemoFirebase(() => db ? query(collection(db, 'initiatives'), where('featured', '==', true), limit(4)) : null, [db]);
  const { data: initiatives } = useCollection(initiativesQuery);

  // Focus Areas (What We Do)
  const focusAreasQuery = useMemoFirebase(() => db ? query(collection(db, 'focusAreas'), orderBy('order', 'asc'), limit(4)) : null, [db]);
  const { data: focusAreas } = useCollection(focusAreasQuery);

  // Stats
  const statsQuery = useMemoFirebase(() => db ? query(collection(db, 'impactStats'), orderBy('order', 'asc')) : null, [db]);
  const { data: stats } = useCollection(statsQuery);

  return (
    <div className="space-y-0">
      <Hero data={hero} />

      {/* Featured Story Section */}
      <FeaturedStory story={featuredStory} />

      {/* What We Do Section */}
      <WhatWeDoGrid focusAreas={focusAreas} />

      {/* Featured Initiatives Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader 
            title="Featured Initiatives" 
            subtitle="Strategic programs designed to create lasting transformation in healthcare and community development."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {initiatives.map((item, idx) => (
              <Link href="/initiatives" key={item.id || idx} className="group">
                <Card className="h-full border-none shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col relative aspect-[4/5] sm:aspect-auto sm:h-[400px]">
                  <Image 
                    src={item.imageUrl || `https://picsum.photos/seed/init-${idx}/600/800`} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    data-ai-hint="foundation project"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 space-y-2 text-white">
                    <h3 className="text-xl font-bold">{item.title}</h3>
                    <p className="text-sm text-white/70 line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {item.summary}
                    </p>
                    <div className="pt-2">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-accent transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <ImpactStats stats={stats} />

      {/* Partnership Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <div className="space-y-4">
                <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline leading-tight">
                  Stronger Together. <br />Greater Impact.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                  We believe meaningful change happens through collaboration. Partner with us to build healthier, more resilient communities across the globe.
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-10 font-bold bg-primary rounded-full gap-2">
                <Link href="/partnerships">
                  Partner With Us <Handshake className="w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image 
                src="https://picsum.photos/seed/partnership-home/800/600" 
                alt="Partnership" 
                fill 
                className="object-cover"
                data-ai-hint="people hands"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Impact Store Section Teaser */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 items-center">
            <div className="relative h-[400px] lg:h-full">
              <Image 
                src="https://picsum.photos/seed/store-teaser/800/800" 
                alt="Impact Store" 
                fill 
                className="object-cover"
                data-ai-hint="lifestyle products"
              />
            </div>
            <div className="p-12 lg:p-20 space-y-8">
              <div className="space-y-4">
                <span className="text-accent font-bold uppercase tracking-widest text-xs">DIBF Impact Store</span>
                <h2 className="text-3xl md:text-5xl font-bold text-secondary font-headline">Shop With Purpose.</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Every purchase supports initiatives that advance health, promote wellbeing, and create opportunities for lasting impact.
                </p>
              </div>
              <Button asChild size="lg" className="h-14 px-10 font-bold bg-secondary rounded-full gap-2">
                <Link href="/impact-store">
                  Shop the Collection <ShoppingBag className="w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center space-y-16">
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="text-accent font-bold uppercase tracking-widest text-sm">Make An Impact Today</span>
            <h2 className="text-3xl md:text-5xl font-bold font-headline">Join Us in Building a Better World</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { 
                icon: Heart, 
                title: "Donate", 
                text: "Your support helps us continue life-changing work.", 
                link: "/give", 
                cta: "Donate Now" 
              },
              { 
                icon: ShieldCheck, 
                title: "Volunteer", 
                text: "Give your time and skills to uplift communities.", 
                link: "/get-involved", 
                cta: "Get Involved" 
              },
              { 
                icon: Handshake, 
                title: "Partner", 
                text: "Collaborate with us to drive sustainable change.", 
                link: "/partnerships", 
                cta: "Partner With Us" 
              }
            ].map((item, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-white/60 mb-8 leading-relaxed">{item.text}</p>
                <Link href={item.link} className="inline-flex items-center gap-2 text-accent font-bold hover:gap-3 transition-all">
                  {item.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
