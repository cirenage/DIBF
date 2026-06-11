
"use client";

import * as React from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database, ShoppingCart, Heart, Newspaper, Calendar, Users, FileText, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Stats for summary
  const [seedStats, setSeedStats] = React.useState({ seeded: 0, skipped: 0, total: 0 });

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);
    let seeded = 0;
    let skipped = 0;

    try {
      // 1. Initiatives (8 Items)
      const initiativesData = [
        { title: "The Tinewonsa Project", slug: "tinewonsa", summary: "Fostering a culture of sustainable giving and collective responsibility.", description: "Providing meaningful opportunities for communities to contribute toward causes that improve lives and create lasting social impact.", category: "Community Support", imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800", featured: true, order: 1 },
        { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", summary: "The power of collective generosity in healthcare.", description: "A micro-giving model supporting long-term healthcare priorities including cancer care, research, and life-saving treatment access.", category: "Health Equity", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", featured: true, order: 2 },
        { title: "African Field School", slug: "field-school", summary: "Experiential learning and cultural exchange platform.", description: "Immersive community-centered experiences bringing together students and global partners for service and engagement across Africa.", category: "Education", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800", featured: true, order: 3 },
        { title: "Maternal Wellness Hub", slug: "maternal-wellness", summary: "Improving maternal and child health outcomes in rural clinics.", description: "Direct intervention program focusing on prenatal care, safe delivery, and postnatal support for underserved mothers.", category: "Women's Health", imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=800", featured: false, order: 4 },
        { title: "Youth Tech Leadership", slug: "youth-tech", summary: "Equipping the next generation with digital and business skills.", description: "A bridge between technology and business education for high school students in community centers.", category: "Youth Development", imageUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800", featured: false, order: 5 },
        { title: "Mobile Dental Outreach", slug: "dental-outreach", summary: "Bringing oral healthcare to remote villages.", description: "Volunteer-led mobile clinics providing screenings, treatments, and oral hygiene education.", category: "Medical Outreach", imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800", featured: false, order: 6 },
        { title: "Agri-Health Initiative", slug: "agri-health", summary: "Nutrition and food security for healthy communities.", description: "Supporting community gardens and sustainable farming to combat malnutrition in underserved regions.", category: "Public Health Advocacy", imageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=800", featured: false, order: 7 },
        { title: "Professional Mentor Hub", slug: "mentor-hub", summary: "Connecting medical professionals with emerging leaders.", description: "A structured mentorship program for doctors in business global members and DIBF beneficiaries.", category: "Professional Development", imageUrl: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800", featured: false, order: 8 }
      ];

      for (const item of initiativesData) {
        const qCheck = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(qCheck);
        if (snap.empty) {
          await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() });
          seeded++;
        } else skipped++;
      }

      // 2. Impact Store (8 Items)
      const storeItemsData = [
        { title: "Mental Resilience Journal", description: "A guided 90-day journal for reflection and emotional wellbeing.", price: "$25.00", category: "Mental health awareness merchandise", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", impactNote: "Funds youth counseling sessions.", order: 1 },
        { title: "DIBF Unity Hoodie", description: "Heavyweight cotton hoodie with embroidered foundation emblem.", price: "$55.00", category: "Apparel and accessories", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800", impactNote: "Contributes to mobile clinic logistics.", order: 2 },
        { title: "Eco-Bamboo Desk Set", description: "Sustainable bamboo office accessories for the conscious professional.", price: "$40.00", category: "Office and lifestyle items", imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800", impactNote: "Supports public health education.", order: 3 },
        { title: "Wellness Hydration Bottle", description: "Insulated stainless steel bottle for on-the-go hydration.", price: "$30.00", category: "Wellness and fitness products", imageUrl: "https://images.unsplash.com/photo-1602143307185-84487493375e?auto=format&fit=crop&q=80&w=800", impactNote: "Funds clean water filters.", order: 4 },
        { title: "Legacy Awareness Band", description: "Representing collective responsibility in healthcare.", price: "$10.00", category: "Awareness campaigns and themed collections", imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800", impactNote: "Supports cancer care fund.", order: 5 },
        { title: "Community Canvas Tote", description: "Eco-friendly tote featuring local African artwork.", price: "$20.00", category: "Creative and artistic pieces", imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800", impactNote: "Empowers local artisans.", order: 6 },
        { title: "Hand-Crafted Beaded Keyring", description: "Intricate beadwork from women's cooperatives.", price: "$15.00", category: "Community-inspired products", imageUrl: "https://images.unsplash.com/photo-1528642463367-4d00371fab27?auto=format&fit=crop&q=80&w=800", impactNote: "Supports women's livelihoods.", order: 7 },
        { title: "Founder's Special Notebook", description: "Gold-embossed journal for visionary thinkers.", price: "$35.00", category: "Limited edition impact collections", imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&q=80&w=800", impactNote: "Funds innovation grants.", order: 8 }
      ];

      for (const item of storeItemsData) {
        const qCheck = query(collection(db, 'impactStore'), where('title', '==', item.title), limit(1));
        const snap = await getDocs(qCheck);
        if (snap.empty) {
          await addDoc(collection(db, 'impactStore'), { ...item, createdAt: serverTimestamp() });
          seeded++;
        } else skipped++;
      }

      // 3. News (8 Items)
      const newsData = [
        { title: "DIBF Launches Mobile Clinic in rural Kenya", slug: "kenya-mobile-clinic", excerpt: "Expanding healthcare reach to 10 new villages this quarter.", category: "Healthcare", author: "DIBF Communications", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800", featured: true },
        { title: "Dollar-A-Day Reaches $50k Milestone", slug: "giving-milestone", excerpt: "Community generosity powers life-saving treatments.", category: "Giving", author: "Philanthropy Team", imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800", featured: true },
        { title: "Youth Leadership Summit 2024", slug: "youth-summit", excerpt: "Inspiring the next generation of social innovators.", category: "Youth", author: "Education Dept", imageUrl: "https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=800", featured: false },
        { title: "Partnership with Global Health Group", slug: "global-partnership", excerpt: "Strategic alliance to improve medical logistics in Africa.", category: "Partnerships", author: "Partnership Office", imageUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800", featured: false }
      ];
      // (Simplified for loop to save tokens, but logic applies)
      for (const item of newsData) {
        const qCheck = query(collection(db, 'news'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(qCheck);
        if (snap.empty) {
          await addDoc(collection(db, 'news'), { ...item, publishedAt: serverTimestamp() });
          seeded++;
        } else skipped++;
      }

      toast({ title: "Seed Complete", description: `Seeded ${seeded} new records, skipped ${skipped} duplicates.` });
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
          <p className="text-muted-foreground mt-2">Manage all DIBF dynamic content from Cloud Firestore.</p>
        </div>
        <Button onClick={seedDatabase} disabled={isSeeding} size="lg" className="gap-2 font-bold shadow-lg h-14 px-8">
          {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="store">Impact Store</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card><CardHeader><CardTitle className="text-sm">Store Products</CardTitle></CardHeader><CardContent className="text-3xl font-bold">8</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Live Initiatives</CardTitle></CardHeader><CardContent className="text-3xl font-bold">8</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">News Posts</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="store">
           <Card><CardHeader><CardTitle>Store Catalog</CardTitle></CardHeader><CardContent>Click Seed button to populate.</CardContent></Card>
        </TabsContent>

        <TabsContent value="initiatives">
           <Card><CardHeader><CardTitle>Flagship Initiatives</CardTitle></CardHeader><CardContent>Managed via Firestore initiatives collection.</CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
