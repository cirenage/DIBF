
"use client";

import * as React from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, Heart, Info, ArrowRight, Sparkles, BrainCircuit, Shirt, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';

export default function ImpactStorePage() {
  const db = useFirestore();
  const storeQuery = useMemoFirebase(() => db ? query(collection(db, 'impactStore'), orderBy('order', 'asc')) : null, [db]);
  const { data: items, loading } = useCollection(storeQuery);

  const categories = [
    { name: "Mental health awareness merchandise", icon: BrainCircuit },
    { name: "Apparel and accessories", icon: Shirt },
    { name: "Office and lifestyle items", icon: ShoppingBag },
    { name: "Wellness and fitness products", icon: Heart },
  ];

  const impactAreas = [
    "Health and community wellbeing",
    "Youth empowerment",
    "Mental health awareness",
    "Medical outreach and public health initiatives",
    "Sustainable giving efforts",
    "Humanitarian and community development programs"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary text-white py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center space-y-8 max-w-4xl">
          <RevealItem>
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-bold uppercase tracking-widest border border-accent/30 mb-4">
              DIBF Impact Store
            </span>
            <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">
              Shop With Purpose. <br /><span className="text-accent">Support Meaningful Impact.</span>
            </h1>
          </RevealItem>
          <RevealItem>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed italic font-body">
              "The DIBF Impact Store transforms everyday purchases into opportunities for impact. 
              Through purpose-driven products, every purchase contributes toward initiatives that advance 
              health, human dignity, and sustainable development across underserved communities."
            </p>
          </RevealItem>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg" className="h-14 px-8 font-bold gap-2">
              <Link href="#products">Explore Products <ArrowRight className="w-4 h-4" /></Link>
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 blur-3xl rounded-full" />
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <SectionHeader 
            title="A Culture of Shared Responsibility" 
            subtitle="The DIBF Impact Store represents a culture of purpose, where products become conversation starters, symbols of advocacy, and tools for positive change."
          />
        </div>
      </section>

      {/* Product Grid */}
      <section id="products" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <h2 className="text-3xl font-bold text-secondary">Featured Collections</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat, i) => (
                <Badge key={i} variant="outline" className="px-4 py-2 border-primary/20 bg-white hover:bg-primary hover:text-white transition-colors cursor-pointer gap-2">
                  <cat.icon className="w-3.5 h-3.5" />
                  {cat.name.split(' ')[0]}
                </Badge>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-96 bg-white/50 animate-pulse rounded-2xl" />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-muted">
              <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">New impact collections arriving soon.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {items.map((item, idx) => (
                <RevealItem key={item.id || idx}>
                  <Card className="group h-full flex flex-col border-none shadow-lg hover:shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <Image 
                        src={item.imageUrl || "https://picsum.photos/seed/dibf-product/600/600"} 
                        alt={item.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        data-ai-hint="impact merchandise"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-primary/90 text-white backdrop-blur-sm">{item.category}</Badge>
                      </div>
                    </div>
                    <CardHeader className="p-6 pb-2">
                      <div className="flex justify-between items-start gap-2">
                        <CardTitle className="text-xl font-bold text-secondary line-clamp-1">{item.title}</CardTitle>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 flex-1 space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="bg-accent/5 p-3 rounded-xl flex gap-3 items-start border border-accent/10">
                        <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        <p className="text-[11px] font-bold text-accent-foreground leading-tight uppercase tracking-wider">
                          <span className="opacity-60 block mb-0.5">Impact Note:</span>
                          {item.impactNote}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 pt-0">
                      <Button className="w-full gap-2 font-bold shadow-md">
                        <ShoppingBag className="w-4 h-4" />
                        Purchase with Purpose
                      </Button>
                    </CardFooter>
                  </Card>
                </RevealItem>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <ScrollReveal alignment="left">
                <h2 className="text-3xl md:text-5xl font-bold font-headline">Support Through Every Purchase</h2>
                <p className="text-lg text-white/70 max-w-xl">
                  When you shop through the DIBF Impact Store, you are directly supporting initiatives that contribute to:
                </p>
              </ScrollReveal>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {impactAreas.map((area, i) => (
                  <div key={i} className="flex gap-3 items-center bg-white/5 p-4 rounded-xl border border-white/10 group hover:bg-white/10 transition-colors">
                    <Heart className="w-5 h-5 text-accent shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{area}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 rounded-3xl p-10 border border-white/10 text-center space-y-8">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-accent/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold font-headline">Together, we can transform everyday purchases into lasting impact.</h3>
              <p className="text-white/60">All proceeds from the Impact Store are strictly audited and funneled directly into DIBF Outreach Programs.</p>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 h-14 px-10 font-bold">
                <Link href="/contact">Bulk Orders & Corporate Gifting</Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 translate-x-1/2" />
      </section>
    </div>
  );
}
