
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
      // 1. Hero Sections
      const heroes = [
        { 
          id: 'home', 
          eyebrow: "Healing Communities. Empowering Futures.", 
          heading: "Advancing Health, Human Dignity, and Sustainable Development", 
          body: "DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to health equity and sustainable development.",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1920" 
        },
        { 
          id: 'about', 
          heading: "Who We Are", 
          body: "DIBF advances health equity, community wellbeing, and sustainable development across Africa and the global community.",
          imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1920"
        }
      ];
      for (const h of heroes) {
        await setDoc(doc(db, 'heroSections', h.id), { ...h, updatedAt: serverTimestamp() }, { merge: true });
        seeded++;
      }

      // 2. Site Content (Critical for Partnership, Store Teaser, etc)
      const content = [
        {
          id: 'partnership',
          title: "Stronger Together. Greater Impact.",
          description: "We believe meaningful change happens through collaboration. Partner with us to build healthier, more resilient communities across the globe.",
          imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200"
        },
        {
          id: 'storeTeaser',
          title: "Shop With Purpose.",
          description: "Every purchase supports initiatives that advance health, promote wellbeing, and create opportunities for lasting impact.",
          imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200"
        },
        {
          id: 'aboutWhoWeAre',
          title: "Who We Are",
          subtitle: "Established to advance health equity and human dignity by transforming shared responsibility into action.",
          description: "DIBF was founded as the social impact arm of Doctors in Business Global. We support initiatives that improve lives and expansion of resilient communities.",
          imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200"
        }
      ];
      for (const c of content) {
        await setDoc(doc(db, 'siteContent', c.id), { ...c, updatedAt: serverTimestamp() }, { merge: true });
        seeded++;
      }

      // 3. Focus Areas
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

      // 4. Impact Stats
      const stats = [
        { label: "Lives Impacted", value: 15000, suffix: "+", order: 1 },
        { label: "Communities Reached", value: 100, suffix: "+", order: 2 },
        { label: "Partners & Collaborators", value: 80, suffix: "+", order: 3 },
        { label: "Youth Empowered", value: 5000, suffix: "+", order: 4 }
      ];
      for (const item of stats) {
        const q = query(collection(db, 'impactStats'), where('label', '==', item.label), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'impactStats'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 5. Initiatives
      const initiatives = [
        { title: "The Tinewonsa Project", slug: "tinewonsa", summary: "Fostering a culture of sustainable giving and collective responsibility.", description: "Opportunities for individuals and institutions to contribute to lasting social impact.", category: "Community Support", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", bullets: ["Promoting generosity", "Community-led giving", "Lasting impact"], featured: true, order: 1 },
        { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", summary: "The power of collective generosity in healthcare.", description: "Supports cancer care, research, and life-saving treatments in underserved areas.", category: "Health Equity", imageUrl: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&q=80&w=800", bullets: ["Cancer care", "Treatment access", "Health innovation"], featured: true, order: 2 },
        { title: "African Field School", slug: "field-school", summary: "Experiential learning and cultural exchange platform.", description: "Immersive community-centered experiences for students and researchers.", category: "Education", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", bullets: ["Experiential learning", "Cultural exchange", "Community impact"], featured: true, order: 3 },
        { title: "DIBF Impact Store", slug: "impact-store", summary: "Transforming everyday purchases into opportunities for impact.", description: "Shop with purpose to support health and community initiatives.", category: "Sustainable Giving", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", bullets: ["Ethical products", "Program support", "Community empowerment"], featured: true, order: 4 }
      ];
      for (const item of initiatives) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 6. Impact Store Items
      const storeItems = [
        { title: "Mental Health Awareness Kit", description: "A collection of journals and wellness tools.", price: "$25.00", category: "Mental health awareness merchandise", imageUrl: "https://images.unsplash.com/photo-1512418490979-92798ccc1380?auto=format&fit=crop&q=80&w=800", impactNote: "Supports youth mental health outreach", order: 1 },
        { title: "Foundation Signature Tee", description: "Ethically sourced organic cotton t-shirt.", price: "$35.00", category: "Apparel and accessories", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800", impactNote: "Funds 1 week of medical supplies", order: 2 }
      ];
      for (const item of storeItems) {
        const q = query(collection(db, 'impactStore'), where('title', '==', item.title), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'impactStore'), { ...item, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      // 7. Impact Stories
      const stories = [
        { title: "A New Clinical Hub in Ghana", summary: "How the Tinewonsa Project transformed rural healthcare in the Ashanti region.", beneficiary: "Village of Ejisu", featured: true, category: "Healthcare", imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800" }
      ];
      for (const story of stories) {
        const q = query(collection(db, 'impactStories'), where('title', '==', story.title), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) { await addDoc(collection(db, 'impactStories'), { ...story, createdAt: serverTimestamp() }); seeded++; } else skipped++;
      }

      toast({ title: "Seed Complete", description: `Seeded ${seeded} records. Collections 'siteContent' and 'heroSections' are now populated.` });
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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
             <Card><CardHeader><CardTitle className="text-sm">Initiatives</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Focus Areas</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Site Content (CMS)</CardTitle></CardHeader><CardContent className="text-3xl font-bold">3</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Store Items</CardTitle></CardHeader><CardContent className="text-3xl font-bold">2</CardContent></Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
