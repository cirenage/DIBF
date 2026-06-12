
"use client";

import * as React from 'react';
import { useFirestore } from '@/firebase';
import { collection, addDoc, setDoc, doc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
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
      // 0. Hero Section
      const heroContent = {
        eyebrow: "Healing Communities. Empowering Futures.",
        heading: "Advancing Health, Human Dignity, and Sustainable Development",
        body: "DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to health equity, youth empowerment, and sustainable humanitarian interventions across Africa and the global community.",
        imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1920",
        updatedAt: serverTimestamp()
      };
      await setDoc(doc(db, 'heroSections', 'home'), heroContent, { merge: true });
      seeded++;

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
        { label: "Partners & Collaborators", value: 200, suffix: "+", order: 3 },
        { label: "Youth Empowered", value: 5000, suffix: "+", order: 4 }
      ];
      for (const item of stats) {
        const q = query(collection(db, 'impactStats'), where('label', '==', item.label), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'impactStats'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 3. Initiatives
      const initiatives = [
        { title: "The Tinewonsa Project", slug: "tinewonsa", summary: "Fostering a culture of sustainable giving and collective responsibility.", description: "The Tinewonsa Project reflects DIBF’s commitment to fostering a culture of sustainable giving and collective responsibility. Through this initiative, individuals, institutions, and communities are provided meaningful opportunities to contribute toward causes that improve lives, strengthen communities, and create lasting social impact.", category: "Community Support", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", bullets: ["Promoting a spirit of generosity", "Community-led giving", "Long-term social impact"], featured: true, order: 1 },
        { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", summary: "The power of collective generosity in healthcare.", description: "The Dollar-A-Day Campaign reflects the power of collective generosity. Through everyday giving, the initiative supports long-term healthcare priorities, including cancer care and research, life-saving treatment access, critical medical support services, and healthcare innovations that strengthen health systems and improve lives across underserved communities.", category: "Health Equity", imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800", bullets: ["Cancer care and research", "Life-saving treatment access", "Healthcare innovation and support services"], featured: true, order: 2 },
        { title: "African Field School", slug: "field-school", summary: "Experiential learning and cultural exchange platform.", description: "The Doctors in Business African Field School is a platform for experiential learning, service, cultural exchange, and meaningful engagement across Africa. It brings together students, researchers, institutions, and global partners for immersive community-centered experiences.", category: "Education", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", bullets: ["Immersive learning experiences", "Cultural exchange and global perspectives", "Community-centered impact projects"], featured: true, order: 3 },
        { title: "DIBF Impact Store", slug: "impact-store", summary: "Transforming everyday purchases into opportunities for impact.", description: "The DIBF Impact Store transforms everyday purchases into opportunities for impact. Through purpose-driven products and awareness initiatives, the store supports programs that advance health, community development, and social good while encouraging a culture of giving and social responsibility.", category: "Sustainable Giving", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", bullets: ["Ethical and purpose-driven products", "Supporting DIBF programs", "Empowering communities"], featured: true, order: 4 }
      ];
      for (const item of initiatives) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 4. Impact Story
      const story = {
        title: "Hope Restored Through Community Outreach",
        summary: "Mobile clinics brought essential care to remote communities, improving health and saving lives.",
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
          <p className="text-muted-foreground mt-2">Manage DIBF dynamic content and system state.</p>
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
             <Card><CardHeader><CardTitle className="text-sm">Impact Stats</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
