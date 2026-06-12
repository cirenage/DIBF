
"use client";

import * as React from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);
    let seeded = 0;
    let skipped = 0;

    try {
      // 1. Focus Areas
      const focusAreas = [
        { title: "Health & Wellbeing", description: "Improving access to care and promoting healthier, stronger communities.", iconName: "Stethoscope", link: "/what-we-do", order: 1 },
        { title: "Youth Empowerment", description: "Equipping young people with opportunities, leadership, and skills for the future.", iconName: "GraduationCap", link: "/what-we-do", order: 2 },
        { title: "Mental Health", description: "Promoting mental wellbeing, resilience, and support for youth and communities.", iconName: "BrainCircuit", link: "/what-we-do", order: 3 },
        { title: "Sustainable Giving", description: "Mobilizing resources today to create lasting impact tomorrow.", iconName: "Heart", link: "/what-we-do", order: 4 }
      ];
      for (const item of focusAreas) {
        const q = query(collection(db, 'focusAreas'), where('title', '==', item.title), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'focusAreas'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 2. Impact Stats
      const stats = [
        { label: "Lives Impacted", value: 50000, suffix: "+", order: 1 },
        { label: "Communities Reached", value: 100, suffix: "+", order: 2 },
        { label: "Partners & Collaborators", value: 200, suffix: "+", order: 3 }
      ];
      for (const item of stats) {
        const q = query(collection(db, 'impactStats'), where('label', '==', item.label), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'impactStats'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 3. Initiatives
      const initiatives = [
        { title: "The Tinewonsa Project", slug: "tinewonsa", summary: "Fostering a culture of sustainable giving and collective responsibility.", description: "Community-led giving for long-term social impact.", category: "Community Support", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", featured: true, order: 1 },
        { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", summary: "The power of collective generosity in healthcare.", description: "Micro-giving supporting cancer care and medical innovations.", category: "Health Equity", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", featured: true, order: 2 },
        { title: "African Field School", slug: "field-school", summary: "Experiential learning and cultural exchange platform.", description: "Immersive community-centered medical education.", category: "Education", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", featured: true, order: 3 },
        { title: "DIBF Impact Store", slug: "impact-store", summary: "Transforming everyday purchases into opportunities for impact.", description: "Purpose-driven products supporting foundation programs.", category: "Sustainable Giving", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", featured: true, order: 4 }
      ];
      for (const item of initiatives) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 4. Impact Story
      const story = {
        title: "Bringing Health Education to Underserved Communities",
        summary: "Through community outreach and health education, we are empowering families with knowledge that saves lives and builds healthier futures.",
        imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800",
        featured: true,
        category: "Healthcare"
      };
      const storyQ = query(collection(db, 'impactStories'), where('title', '==', story.title), limit(1));
      const storySnap = await getDocs(storyQ);
      if (storySnap.empty) { await addDoc(collection(db, 'impactStories'), { ...story, createdAt: serverTimestamp() }); seeded++; }

      toast({ title: "Seed Complete", description: `Seeded ${seeded} records, skipped ${skipped} duplicates.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error Seeding", description: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Admin Hub
          </h1>
          <p className="text-muted-foreground mt-2">Manage DIBF dynamic content from Cloud Firestore.</p>
        </div>
        <Button onClick={seedDatabase} disabled={isSeeding} size="lg" className="gap-2 font-bold shadow-lg h-14 px-8 rounded-full">
          {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content Status</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card><CardHeader><CardTitle className="text-sm">Initiatives</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Focus Areas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Impact Stats</CardTitle></CardHeader><CardContent className="text-3xl font-bold">3</CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
