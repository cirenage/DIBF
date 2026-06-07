
"use client";

import { Hero } from '@/components/home/Hero';
import { MissionVision } from '@/components/home/MissionVision';
import { WhatWeDoGrid } from '@/components/home/WhatWeDoGrid';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Heart, Users, Shield, Globe, Sprout } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';
import { motion } from 'framer-motion';

export default function Home() {
  const initiatives = [
    {
      id: "tinewonsa",
      title: "The Tinewonsa Project",
      desc: "Revolutionizing primary healthcare delivery in rural Africa through community-led clinical hubs.",
      img: PlaceHolderImages.find(i => i.id === 'initiative-tinewonsa')?.imageUrl || "https://picsum.photos/seed/tinewonsa/600/400",
      category: "Healthcare Delivery"
    },
    {
      id: "dollar-a-day",
      title: "Dollar-A-Day Campaign",
      desc: "Sustainable micro-philanthropy enabling continuous funding for essential medical supplies and child nutrition.",
      img: PlaceHolderImages.find(i => i.id === 'initiative-fieldschool')?.imageUrl || "https://picsum.photos/seed/fieldschool/600/400",
      category: "Sustainable Giving"
    },
    {
      id: "field-school",
      title: "African Field School",
      desc: "Practical medical education for international students focusing on tropical medicine and public health.",
      img: PlaceHolderImages.find(i => i.id === 'youth-empowerment')?.imageUrl || "https://picsum.photos/seed/field-school/600/400",
      category: "Education"
    }
  ];

  const focusAreas = [
    "Health and Wellbeing", "Community Development", "Youth Leadership", "Mental Health Awareness", 
    "Women and Family Support", "Education and Learning", "Humanitarian Initiatives", 
    "Sustainable Giving", "Global Collaboration"
  ];

  const trustFactors = [
    { title: "Healthcare-Informed Impact", icon: Shield },
    { title: "Community-Centered Development", icon: Users },
    { title: "Sustainable Giving Model", icon: Sprout },
    { title: "Partnership-Driven Results", icon: Heart },
    { title: "Africa-Rooted Global Reach", icon: Globe }
  ];

  const communityImpactImage = PlaceHolderImages.find(i => i.id === 'community-impact')?.imageUrl || "https://picsum.photos/seed/dibf-community/800/600";
  const partnershipHandshakeImage = PlaceHolderImages.find(i => i.id === 'partnership-handshake')?.imageUrl || "https://picsum.photos/seed/partnership/800/600";

  return (
    <div className="space-y-0">
      <Hero />
      
      <ScrollReveal direction="up">
        <MissionVision />
      </ScrollReveal>
      
      {/* Why DIBF */}
      <section className="py-24 bg-secondary text-white relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left" className="space-y-8">
              <SectionHeader 
                title="Why Stand With DIBF?" 
                alignment="left" 
                accent={true} 
                className="mb-8"
              />
              <p className="text-xl text-white/70 leading-relaxed">
                As the nonprofit arm of Doctors in Business Global, we bring medical precision and 
                business efficiency to the world's most pressing humanitarian challenges.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {trustFactors.map((factor, i) => (
                  <RevealItem key={i}>
                    <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                      <factor.icon className="w-8 h-8 text-primary" />
                      <span className="font-semibold">{factor.title}</span>
                    </div>
                  </RevealItem>
                ))}
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="relative">
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src={communityImpactImage}
                  alt="DIBF Impact"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary rounded-2xl -z-1" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-accent rounded-full -z-1 opacity-20" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      <ScrollReveal>
        <WhatWeDoGrid />
      </ScrollReveal>

      {/* Initiatives Preview */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader 
              title="Our Flagship Initiatives" 
              subtitle="Scaling impact through targeted, sustainable programs that transform communities from the inside out."
            />
          </ScrollReveal>
          <ScrollReveal 
            staggerChildren={0.2} 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {initiatives.map((item, idx) => (
              <RevealItem key={idx}>
                <Card className="overflow-hidden border-none shadow-lg group hover:shadow-2xl transition-all duration-500">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={item.img} 
                      alt={item.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-primary hover:bg-white">{item.category}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold font-headline mb-3 text-secondary">{item.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                      {item.desc}
                    </p>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <Button asChild variant="link" className="p-0 h-auto text-primary gap-2 group-hover:gap-3 transition-all">
                      <Link href={`/initiatives#${item.id}`}>Learn more <ArrowRight className="w-4 h-4" /></Link>
                    </Button>
                  </CardFooter>
                </Card>
              </RevealItem>
            ))}
          </ScrollReveal>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="px-8 hover:translate-y-[-2px] transition-all">
              <Link href="/initiatives">View All Initiatives</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Focus Areas Pill Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader 
              title="Core Focus Areas" 
              subtitle="Our holistic model addresses interconnected challenges to build resilient ecosystems of dignity and health."
            />
          </ScrollReveal>
          <ScrollReveal staggerChildren={0.1} className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {focusAreas.map((area, idx) => (
              <RevealItem key={idx}>
                <div className="flex items-center gap-2 px-6 py-3 bg-muted rounded-full text-secondary font-medium hover:bg-primary/10 hover:text-primary transition-all cursor-default border border-transparent hover:border-primary/20">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  {area}
                </div>
              </RevealItem>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Partnerships CTA */}
      <section className="py-24 bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/20 skew-x-12 translate-x-1/2" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left" className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-headline font-bold">Partnerships for Impact</h2>
              <p className="text-xl text-white/80 leading-relaxed">
                We believe in the power of shared responsibility. DIBF welcomes collaboration with universities, 
                healthcare institutions, corporations, foundations, and individuals to amplify our collective reach.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" variant="secondary" className="px-8 font-bold hover:translate-y-[-2px] transition-all">
                  <Link href="/partnerships">Become a Partner</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="px-8 border-white/30 text-white hover:bg-white hover:text-primary font-bold hover:translate-y-[-2px] transition-all">
                  <Link href="/contact">Inquire Now</Link>
                </Button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right" className="hidden lg:block relative h-[400px]">
               <Image 
                  src={partnershipHandshakeImage}
                  alt="Global Partnerships"
                  fill
                  className="object-cover rounded-2xl shadow-2xl"
               />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Get Involved CTAs */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader title="Get Involved" />
          </ScrollReveal>
          <ScrollReveal staggerChildren={0.2} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md hover:shadow-xl">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline">Volunteer</h3>
                <p className="text-muted-foreground text-sm">Join our medical outreach missions or support our operations remotely with your unique skills.</p>
                <Button asChild variant="outline" className="w-full group">
                  <Link href="/get-involved" className="flex items-center justify-center gap-2">
                    Learn More <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </Button>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md hover:shadow-xl">
                <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline">Institutional Support</h3>
                <p className="text-muted-foreground text-sm">Bring your team or institution to Africa for a transformative shared service experience.</p>
                <Button asChild variant="outline" className="w-full group">
                  <Link href="/get-involved" className="flex items-center justify-center gap-2">
                    Bring a Team <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </Link>
                </Button>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card className="p-8 h-full space-y-4 hover:-translate-y-2 transition-all duration-500 border-none shadow-md hover:shadow-xl bg-primary text-white">
                <div className="w-12 h-12 bg-white/20 text-white rounded-lg flex items-center justify-center">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold font-headline">Donate</h3>
                <p className="text-white/80 text-sm">Every contribution fuels sustainable clinics, student scholarships, and life-saving interventions.</p>
                <Button asChild className="w-full bg-white text-primary hover:bg-white/90">
                  <Link href="/give">Give Now</Link>
                </Button>
              </Card>
            </RevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 bg-secondary text-white text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full -ml-32 -mt-32 blur-3xl" />
        <div className="container mx-auto px-4 max-w-3xl space-y-8 relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl font-headline font-bold italic">Be Part of the Journey</h2>
            <p className="text-xl text-white/70 mt-4">
              Your standing with DIBF creates lasting change across Africa and underserved communities globally. 
              Together, we are building a more equitable and dignified world.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.2} className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" variant="default" className="px-10 h-14 text-lg font-bold shadow-lg hover:translate-y-[-2px] transition-all">
              <Link href="/give">Give Today</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-10 h-14 text-lg font-bold border-white/30 text-white hover:bg-white hover:text-secondary hover:translate-y-[-2px] transition-all">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
