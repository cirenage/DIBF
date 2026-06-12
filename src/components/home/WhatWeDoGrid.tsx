
"use client";

import { Stethoscope, GraduationCap, BrainCircuit, Heart, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface WhatWeDoGridProps {
  focusAreas?: any[];
}

const ICON_MAP: Record<string, any> = {
  Stethoscope,
  GraduationCap,
  BrainCircuit,
  Heart
};

export function WhatWeDoGrid({ focusAreas }: WhatWeDoGridProps) {
  const defaultAreas = [
    {
      title: "Health & Wellbeing",
      description: "Improving access to care and promoting healthier, stronger communities.",
      iconName: "Stethoscope",
      link: "/what-we-do"
    },
    {
      title: "Youth Empowerment",
      description: "Equipping young people with opportunities, leadership, and skills for the future.",
      iconName: "GraduationCap",
      link: "/what-we-do"
    },
    {
      title: "Mental Health",
      description: "Promoting mental wellbeing, resilience, and support for youth and communities.",
      iconName: "BrainCircuit",
      link: "/what-we-do"
    },
    {
      title: "Sustainable Giving",
      description: "Mobilizing resources today to create lasting impact tomorrow.",
      iconName: "Heart",
      link: "/what-we-do"
    }
  ];

  const data = focusAreas && focusAreas.length > 0 ? focusAreas : defaultAreas;

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <span className="text-primary font-bold uppercase tracking-widest text-xs">What We Do</span>
          <h2 className="text-3xl md:text-5xl font-headline font-bold text-secondary">Creating Lasting Impact</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, idx) => {
            const Icon = ICON_MAP[item.iconName] || Heart;
            return (
              <Card key={idx} className="border-none shadow-xl hover:shadow-2xl transition-all duration-300 group rounded-3xl p-4">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-headline font-bold text-secondary">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                  <Link 
                    href={item.link || "/what-we-do"} 
                    className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
                  >
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" asChild className="rounded-full px-10 h-12 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all">
            <Link href="/what-we-do">View All Focus Areas</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
