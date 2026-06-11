
"use client";

import * as React from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database, FileText, CheckCircle2, AlertCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Collections to monitor
  const initsRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const storeRef = useMemoFirebase(() => db ? collection(db, 'impactStore') : null, [db]);
  const donationsRef = useMemoFirebase(() => db ? collection(db, 'donations') : null, [db]);

  const { data: initiatives } = useCollection(initsRef);
  const { data: storeItems } = useCollection(storeRef);
  const { data: donations } = useCollection(donationsRef);

  const seedWebsiteData = async () => {
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

      // 2. Impact Store Seeding (Idempotent)
      const storeItemsData = [
        {
          title: "Awareness Hoodie",
          description: "Premium cotton hoodie designed to spark conversations about global health equity.",
          price: "$45.00",
          category: "Apparel and accessories",
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800&auto=format&fit=crop",
          impactNote: "Contributes to Healthcare Support",
          order: 1
        },
        {
          title: "Mental Wellbeing Journal",
          description: "Guided reflection journal to promote daily mindfulness and mental resilience.",
          price: "$22.00",
          category: "Mental health awareness merchandise",
          imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
          impactNote: "Supports Youth Mental Health Programs",
          order: 2
        },
        {
          title: "DIBF Community Tote",
          description: "Eco-friendly tote bag celebrating African resilience and shared responsibility.",
          price: "$15.00",
          category: "Office and lifestyle items",
          imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop",
          impactNote: "Funds Community Outreach Missions",
          order: 3
        },
        {
          title: "Eco Hydration Bottle",
          description: "Double-walled steel bottle. Stay healthy while supporting community water access.",
          price: "$30.00",
          category: "Wellness and fitness products",
          imageUrl: "https://images.unsplash.com/photo-1602143307185-84487493375e?q=80&w=800&auto=format&fit=crop",
          impactNote: "Supports Clean Water Initiatives",
          order: 4
        }
      ];

      for (const item of storeItemsData) {
        const q = query(collection(db, 'impactStore'), where('title', '==', item.title), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, 'impactStore'), { ...item, createdAt: serverTimestamp() });
        }
      }

      // 3. Initiatives Seeding
      const initiativesData = [
        {
          title: "The Tinewonsa Project",
          slug: "tinewonsa",
          summary: "Fostering a culture of sustainable giving and collective responsibility.",
          description: "Individuals, institutions, and communities are provided meaningful opportunities to contribute toward causes that improve lives.",
          category: "Community Support",
          imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=800&auto=format&fit=crop",
          featured: true,
          order: 1
        },
        {
          title: "Dollar-A-Day Campaign",
          slug: "dollar-a-day",
          summary: "The power of collective generosity in healthcare.",
          description: "Supports long-term healthcare priorities including cancer care and research.",
          category: "Health Equity",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop",
          featured: true,
          order: 2
        }
      ];

      for (const item of initiativesData) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() });
        }
      }

      toast({ title: "Success", description: "All foundation website data has been seeded." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
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
          <p className="text-muted-foreground mt-2">Manage all DIBF dynamic content and submissions from one place.</p>
        </div>
        <Button onClick={seedWebsiteData} disabled={isSeeding} className="gap-2 font-bold shadow-lg h-14 px-8">
          {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-12">
          <TabsTrigger value="overview" className="px-6">Overview</TabsTrigger>
          <TabsTrigger value="store" className="px-6">Impact Store</TabsTrigger>
          <TabsTrigger value="content" className="px-6">CMS Content</TabsTrigger>
          <TabsTrigger value="submissions" className="px-6">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Initiatives</CardTitle>
                <div className="text-2xl font-bold text-secondary">{initiatives.length}</div>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Store Products</CardTitle>
                <div className="text-2xl font-bold text-secondary">{storeItems.length}</div>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recent Donations</CardTitle>
                <div className="text-2xl font-bold text-secondary">{donations.length}</div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="store">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Impact Store Management</CardTitle>
                <CardDescription>View and manage products that fund our missions.</CardDescription>
              </div>
              <ShoppingCart className="w-6 h-6 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {storeItems.length === 0 ? (
                <div className="text-center py-20 italic text-muted-foreground">No products found. Seed data to begin.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {storeItems.map((item: any) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-xl items-center bg-muted/30">
                      <div className="w-16 h-16 relative rounded-lg overflow-hidden shrink-0">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-secondary">{item.title}</h4>
                        <p className="text-xs text-muted-foreground">{item.category} • {item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Inquiry Submissions</CardTitle>
              <CardDescription>View messages, volunteer requests, and partnership inquiries.</CardDescription>
            </CardHeader>
            <CardContent>
               <div className="text-center py-12 text-muted-foreground italic">
                 Donations and inquiry collections are actively monitored here.
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
