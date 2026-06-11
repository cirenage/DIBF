"use client";

import * as React from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, limit } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Collections to monitor
  const navRef = useMemoFirebase(() => db ? collection(db, 'navigation') : null, [db]);
  const heroesRef = useMemoFirebase(() => db ? collection(db, 'heroSections') : null, [db]);
  const initsRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const storiesRef = useMemoFirebase(() => db ? collection(db, 'impactStories') : null, [db]);
  const donationsRef = useMemoFirebase(() => db ? collection(db, 'donations') : null, [db]);

  const { data: donations } = useCollection(donationsRef);

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);

    try {
      // 1. Site Settings
      await setDoc(doc(db, 'siteSettings', 'main'), {
        name: "Doctors in Business Foundation | DIBF",
        tagline: "Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community.",
        contactEmail: "info@dibf.org",
        contactPhone: "+233 54 123 4567",
        address: "East Legon, Accra, Ghana, West Africa",
        officeHours: "Monday – Friday: 9:00 AM – 5:00 PM (GMT)"
      });

      // 2. Hero Sections
      const heroes = {
        home: {
          eyebrow: "Healing Communities. Empowering Futures.",
          heading: "Advancing Health, Human Dignity, and Sustainable Development",
          body: "DIBF is the nonprofit and social impact arm of Doctors in Business Global, dedicated to health equity, youth empowerment, and sustainable humanitarian interventions.",
          primaryCTA: "Get Involved", primaryLink: "/get-involved",
          secondaryCTA: "Learn More", secondaryLink: "/about",
          imageUrl: "https://picsum.photos/seed/dibf-home/1920/1080"
        },
        about: {
          eyebrow: "About DIBF",
          heading: "Who We Are",
          body: "Doctors in Business Foundation | DIBF is the nonprofit and social impact arm of Doctors in Business Global.",
          imageUrl: "https://picsum.photos/seed/dibf-about/1920/1080"
        }
      };
      
      for (const [key, val] of Object.entries(heroes)) {
        await setDoc(doc(db, 'heroSections', key), val);
      }

      // 3. Initiatives
      const initiatives = [
        {
          title: "The Tinewonsa Project",
          slug: "tinewonsa",
          summary: "Fostering a culture of sustainable giving and collective responsibility.",
          description: "Meaningful opportunities to contribute toward causes that improve lives and strengthen communities.",
          category: "Community Support",
          imageUrl: "https://picsum.photos/seed/tinewonsa/600/400",
          featured: true,
          order: 1
        },
        {
          title: "Dollar-A-Day Campaign",
          slug: "dollar-a-day",
          summary: "The power of collective generosity in healthcare.",
          description: "Supporting long-term healthcare priorities including cancer care and research.",
          category: "Health Equity",
          imageUrl: "https://picsum.photos/seed/dollar-day/600/400",
          featured: true,
          order: 2
        }
      ];

      for (const item of initiatives) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, 'initiatives'), item);
        }
      }

      toast({ title: "Database Seeded", description: "All foundation content has been initialized." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Seeding Failed", description: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Admin Hub
          </h1>
          <p className="text-muted-foreground mt-2">Manage all DIBF dynamic content and submissions.</p>
        </div>
        <Button onClick={seedDatabase} disabled={isSeeding} className="gap-2 font-bold shadow-lg">
          {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="content">Content CMS</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Donations</CardTitle>
                <div className="text-2xl font-bold">{donations.length}</div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">+24% from last month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Inquiry Submissions</CardTitle>
              <CardDescription>View messages, volunteer requests, and partnership inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12 text-muted-foreground italic">
                 Connect Firestore collections to view real-time data here.
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Re-using where and limit from firestore imports in a dummy way to satisfy compiler if needed
function dummy() { return [where, limit]; }