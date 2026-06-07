"use client";

import * as React from 'react';
import { Hero } from '@/components/home/Hero';
import { MissionVision } from '@/components/home/MissionVision';
import { WhatWeDoGrid } from '@/components/home/WhatWeDoGrid';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, Loader2, Heart, Globe, Sprout } from 'lucide-react';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, where, limit, orderBy } from 'firebase/firestore';

export default function Home() {
  const db = useFirestore();

  // Fetch featured initiatives
  const initiativesRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'initiatives'), where('featured', '==', true), limit(3));
  }, [db]);
  const { data: initiatives, loading: initiativesLoading, error: initiativesError } = useCollection(initiativesRef);

  // Fetch upcoming events
  const eventsRef = useMemoFirebase(() => {
    if (!db) return null;
    // Note: Simple collection query to avoid index requirements during initial rules debug
    return query(collection(db, 'events'), limit(3));
  }, [db]);
  const { data: events, loading: eventsLoading, error: eventsError } = useCollection(eventsRef);

  // Fetch partners
  const partnersRef = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, 'partners'), where('featured', '==', true), limit(6));
  }, [db]);
  const { data: partners } = useCollection(partnersRef);

  // Debug errors
  React.useEffect(() => {
    if (eventsError) console.error("Homepage Events Query Error:", eventsError);
    if (initiativesError) console.error("Homepage Initiatives Query Error:", initiativesError);
  }, [eventsError, initiativesError]);

  return (
    <div className="space-y-0">
      <Hero />
      
      <ScrollReveal direction="up">
        <MissionVision />
      </ScrollReveal>
      
      <WhatWeDoGrid />

      {/* Dynamic Initiatives Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader 
              title="Our Flagship Initiatives" 
              subtitle="Scaling impact through targeted, sustainable programs that transform communities from the inside out."
            />
          </ScrollReveal>
          
          {initiativesLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : initiatives.length > 0 ? (
            <ScrollReveal staggerChildren={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {initiatives.map((item, idx) => (
                <RevealItem key={item.id || idx}>
                  <Card className="overflow-hidden border-none shadow-lg group hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={item.imageUrl || "https://images.unsplash.com/photo-1576091160550-2173dba999ef"} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-white/90 text-primary hover:bg-white">{item.category}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-6 flex-1">
                      <h3 className="text-xl font-bold font-headline mb-3 text-secondary">{item.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">{item.summary || item.description}</p>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button asChild variant="link" className="p-0 h-auto text-primary gap-2 group-hover:gap-3 transition-all font-bold">
                        <Link href="/initiatives">Learn more <ArrowRight className="w-4 h-4" /></Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </RevealItem>
              ))}
            </ScrollReveal>
          ) : (
            <div className="text-center py-12 text-muted-foreground italic">
              {initiativesError ? "Unable to load initiatives. Please check permissions." : "Seed database via Admin Dashboard to view content."}
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader title="Upcoming Outreaches & Events" subtitle="Join us on the ground and witness the power of community-led development." />
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {eventsLoading ? (
               <div className="col-span-full flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
            ) : events.length > 0 ? (
              events.map((event, idx) => (
                <ScrollReveal key={event.id || idx} direction="up" delay={idx * 0.1}>
                  <Card className="border-none shadow-md hover:shadow-xl transition-all h-full">
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{event.eventDate ? new Date(event.eventDate).toLocaleDateString() : 'Date TBD'}</span>
                      </div>
                      <h3 className="text-xl font-bold text-secondary">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                      <Button asChild variant="outline" className="w-full font-bold">
                        <Link href="/contact">Register Interest</Link>
                      </Button>
                    </div>
                  </Card>
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground italic">
                {eventsError ? "Security access restricted for events." : "No upcoming events scheduled."}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Partners Logos Bar */}
      {partners && partners.length > 0 && (
        <section className="py-16 bg-muted/20 border-y border-muted-foreground/10">
          <div className="container mx-auto px-4">
            <p className="text-center text-xs uppercase tracking-widest text-muted-foreground mb-8 font-bold">Trusted by Global Partners</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60">
              {partners.map((partner: any) => (
                <div key={partner.id} className="grayscale hover:grayscale-0 transition-all cursor-default text-lg font-bold text-secondary text-center px-4">
                  {partner.name}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/20 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Partnerships for Impact</h2>
              <p className="text-xl text-white/80 leading-relaxed">
                We believe in the power of shared responsibility. DIBF welcomes collaboration with universities, 
                healthcare institutions, corporations, and individuals.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary" className="px-8 font-bold">
                  <Link href="/partnerships">Become a Partner</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 text-white border-white/40 font-bold hover:bg-white/10">
                  <Link href="/contact">Inquire Now</Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="hidden lg:block relative h-[350px]">
               <Image 
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902"
                  alt="Global Partnerships"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
               />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal><SectionHeader title="Get Involved" /></ScrollReveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center"><Heart className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-headline">Volunteer</h3>
                <p className="text-muted-foreground text-sm">Join our medical outreach missions or support our operations remotely with your unique skills.</p>
                <Button asChild variant="outline" className="w-full font-bold">
                  <Link href="/contact">Learn More</Link>
                </Button>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center"><Globe className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-headline">Institutional Support</h3>
                <p className="text-muted-foreground text-sm">Bring your team or institution to Africa for a transformative shared service experience.</p>
                <Button asChild variant="outline" className="w-full font-bold">
                  <Link href="/partnerships">Bring a Team</Link>
                </Button>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md bg-primary text-white">
                <div className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center"><Sprout className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold font-headline">Donate</h3>
                <p className="text-white/80 text-sm">Every contribution fuels sustainable clinics, student scholarships, and life-saving interventions.</p>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90 font-bold">
                  <Link href="/give">Give Now</Link>
                </Button>
              </Card>
            </RevealItem>
          </div>
        </div>
      </section>
    </div>
  );
}
