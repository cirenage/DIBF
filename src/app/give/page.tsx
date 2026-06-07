
"use client";

import { SectionHeader } from '@/components/shared/SectionHeader';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, CreditCard, Gift, Landmark, ShieldCheck, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, RevealItem } from '@/components/shared/ScrollReveal';

export default function GivePage() {
  const options = [
    { amount: "$10", benefit: "Provides basic hygiene kits for 5 families.", type: "Essential" },
    { amount: "$50", benefit: "Funds a primary care screening for 10 community members.", type: "Medical" },
    { amount: "$250", benefit: "Supports a student's medical outreach internship for 1 month.", type: "Education" },
    { amount: "$1,000", benefit: "Sponsors a specialized clinical intervention session.", type: "High Impact" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-primary text-white py-24 text-center">
        <ScrollReveal className="container mx-auto px-4 max-w-3xl space-y-6">
          <Badge className="bg-white/20 text-white border-white/30 px-4 py-1">Support Our Mission</Badge>
          <h1 className="text-4xl md:text-6xl font-headline font-bold">Purposeful Giving for Lasting Impact</h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Your contributions fuel sustainable healthcare, education, and community development across Africa 
            and underserved communities globally.
          </p>
        </ScrollReveal>
      </section>

      {/* Why Give */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal staggerChildren={0.2} className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <RevealItem className="space-y-4">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">100% Transparency</h3>
              <p className="text-muted-foreground">Every dollar is tracked and allocated directly to project sites with rigorous reporting.</p>
            </RevealItem>
            <RevealItem className="space-y-4">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">Immediate Impact</h3>
              <p className="text-muted-foreground">Donations are deployed within 30 days to active outreach missions and clinical hub needs.</p>
            </RevealItem>
            <RevealItem className="space-y-4">
              <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6 transition-transform hover:scale-110">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold font-headline">Sustainable Models</h3>
              <p className="text-muted-foreground">We focus on building resilient systems that continue providing value long after initial funding.</p>
            </RevealItem>
          </ScrollReveal>
        </div>
      </section>

      {/* Suggested Giving */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <SectionHeader title="Choose Your Support Path" subtitle="Select a giving level that resonates with your vision for global health equity." />
          </ScrollReveal>
          <ScrollReveal staggerChildren={0.15} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {options.map((opt, i) => (
              <RevealItem key={i}>
                <Card className="border-none shadow-lg hover:-translate-y-2 transition-all duration-500 hover:shadow-2xl h-full flex flex-col">
                  <CardHeader className="text-center pb-2">
                    <Badge variant="secondary" className="mb-4 mx-auto">{opt.type}</Badge>
                    <CardTitle className="text-4xl font-headline font-extrabold text-primary">{opt.amount}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center p-6 flex-1">
                    <p className="text-muted-foreground italic font-body text-sm leading-relaxed">"{opt.benefit}"</p>
                  </CardContent>
                  <CardFooter className="p-6">
                    <Button className="w-full font-bold hover:translate-y-[-2px] transition-all">Select</Button>
                  </CardFooter>
                </Card>
              </RevealItem>
            ))}
          </ScrollReveal>
        </div>
      </section>

      {/* Dollar A Day Feature */}
      <section id="dollar-a-day" className="py-24 bg-secondary text-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <ScrollReveal className="max-w-5xl mx-auto bg-primary/10 backdrop-blur-md rounded-3xl p-8 md:p-16 border border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center transition-transform hover:scale-105">
                  <Heart className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-headline font-bold">The Dollar-A-Day Campaign</h2>
                <p className="text-lg text-white/80 leading-relaxed">
                  Join a global community of micro-philanthropists. Just $1 a day creates a predictable 
                  revenue stream that funds continuous nutritional support and medicine for rural clinics.
                </p>
                <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold px-10 h-14 hover:translate-y-[-2px] transition-all">Join the Campaign</Button>
              </div>
              <div className="space-y-4">
                <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
                  <CardContent className="p-6">
                     <div className="flex justify-between items-center mb-4">
                        <p className="font-bold">Campaign Progress</p>
                        <p className="text-primary font-bold">85%</p>
                     </div>
                     <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                        <ScrollReveal duration={1.5} distance={0} direction="right">
                          <div className="h-full bg-primary w-[85%] transition-all" />
                        </ScrollReveal>
                     </div>
                     <p className="mt-4 text-sm text-white/50">850 active daily donors committed to 2024 goal.</p>
                  </CardContent>
                </Card>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                      <p className="text-2xl font-bold">$365</p>
                      <p className="text-xs text-white/50">Annual Impact</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-xl text-center hover:bg-white/10 transition-colors">
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-xs text-white/50">Lives Saved (Avg)</p>
                   </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Support Methods */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl font-headline font-bold text-secondary">Other Ways to Give</h2>
          </ScrollReveal>
          <ScrollReveal staggerChildren={0.1} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <RevealItem>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-primary/20 text-secondary hover:bg-primary/5 hover:translate-y-[-2px] transition-all">
                <CreditCard className="w-6 h-6 text-primary" />
                Credit/Debit Card
              </Button>
            </RevealItem>
            <RevealItem>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-primary/20 text-secondary hover:bg-primary/5 hover:translate-y-[-2px] transition-all">
                <Landmark className="w-6 h-6 text-primary" />
                Bank Transfer
              </Button>
            </RevealItem>
            <RevealItem>
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-primary/20 text-secondary hover:bg-primary/5 hover:translate-y-[-2px] transition-all">
                <Gift className="w-6 h-6 text-primary" />
                Stock & Assets
              </Button>
            </RevealItem>
          </ScrollReveal>
          <ScrollReveal delay={0.4} className="mt-12 text-center text-muted-foreground text-sm">
            For major donor inquiries, legacy giving, or corporate match programs, 
            please contact our development director at <strong>giving@dibf.org</strong>.
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
