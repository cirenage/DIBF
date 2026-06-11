
"use client";

import * as React from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database, FileText, CheckCircle2, AlertCircle, ShoppingCart, Users, Heart, Globe, Newspaper, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Memoized collection references
  const initsRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const storeRef = useMemoFirebase(() => db ? collection(db, 'impactStore') : null, [db]);
  const newsRef = useMemoFirebase(() => db ? collection(db, 'news') : null, [db]);
  const eventsRef = useMemoFirebase(() => db ? collection(db, 'events') : null, [db]);
  const teamRef = useMemoFirebase(() => db ? collection(db, 'team') : null, [db]);

  const { data: initiatives } = useCollection(initsRef);
  const { data: storeItems } = useCollection(storeRef);
  const { data: newsPosts } = useCollection(newsRef);
  const { data: events } = useCollection(eventsRef);

  const seedWebsiteData = async () => {
    if (!db) return;
    setIsSeeding(true);

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Operation timed out (15s)")), 15000)
    );

    const seedingTask = async () => {
      // 1. Site Settings
      await setDoc(doc(db, 'siteSettings', 'main'), {
        name: "Doctors in Business Foundation | DIBF",
        tagline: "Advancing Health, Human Dignity, and Sustainable Development Across Africa and the Global Community.",
        contactEmail: "info@dibf.org",
        contactPhone: "+233 54 123 4567",
        address: "East Legon, Accra, Ghana, West Africa",
        officeHours: "Monday – Friday: 9:00 AM – 5:00 PM (GMT)"
      });

      // 2. Impact Store Seeding (Comprehensive)
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
        },
        {
          title: "Unity Campaign Wristband",
          description: "Symbol of collective generosity and healthcare support.",
          price: "$5.00",
          category: "Awareness campaigns and themed collections",
          imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop",
          impactNote: "Supports the Dollar-A-Day Campaign",
          order: 5
        },
        {
          title: "Traditional Artisan Basket",
          description: "Hand-woven by community partners, showcasing local talent and craftsmanship.",
          price: "$55.00",
          category: "Creative and artistic pieces",
          imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?q=80&w=800&auto=format&fit=crop",
          impactNote: "Directly Empowers Local Artisans",
          order: 6
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

      return "Data seeded successfully";
    };

    try {
      await Promise.race([seedingTask(), timeoutPromise]);
      toast({ title: "Success", description: "Website dynamic data has been seeded." });
    } catch (e: any) {
      toast({ 
        variant: "destructive", 
        title: "Seeding Error", 
        description: e.code === 'permission-denied' 
          ? "Permission Denied. Check Firestore rules." 
          : (e.message || "Unknown error occurred.")
      });
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
          Seed All Website Data
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Initiatives
                </CardTitle>
                <div className="text-2xl font-bold text-secondary">{initiatives.length}</div>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" /> Store Products
                </CardTitle>
                <div className="text-2xl font-bold text-secondary">{storeItems.length}</div>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Newspaper className="w-4 h-4" /> News
                </CardTitle>
                <div className="text-2xl font-bold text-secondary">{newsPosts.length}</div>
              </CardHeader>
            </Card>
            <Card className="border-none shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Events
                </CardTitle>
                <div className="text-2xl font-bold text-secondary">{events.length}</div>
              </CardHeader>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="store">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
              <div>
                <CardTitle>Impact Store Catalog</CardTitle>
                <CardDescription>All items available for purpose-driven purchase.</CardDescription>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary/20" />
            </CardHeader>
            <CardContent className="pt-6">
              {storeItems.length === 0 ? (
                <div className="text-center py-20 italic text-muted-foreground">No products found. Seed data to begin.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeItems.map((item: any) => (
                    <div key={item.id} className="flex flex-col p-4 border rounded-xl bg-muted/20 group hover:border-primary/50 transition-colors">
                      <div className="w-full h-40 relative rounded-lg overflow-hidden mb-4 border">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-secondary leading-tight">{item.title}</h4>
                        <span className="text-primary font-bold">{item.price}</span>
                      </div>
                      <Badge variant="outline" className="w-fit text-[10px] mb-3">{item.category}</Badge>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{item.description}</p>
                      <div className="mt-auto pt-3 border-t flex items-center gap-2">
                        <Heart className="w-3 h-3 text-accent" />
                        <span className="text-[10px] font-bold text-accent uppercase tracking-tighter">Impact: {item.impactNote}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submissions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Recent Inquiries</CardTitle>
                <CardDescription>Contact messages and site feedback.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground italic border-2 border-dashed rounded-xl">
                  Inquiry logs are protected for privacy.
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-lg text-white bg-primary">
              <CardHeader>
                <CardTitle className="text-lg">Donation Intents</CardTitle>
                <CardDescription className="text-white/70">Recorded pledges and store checkout intents.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 italic border-2 border-dashed border-white/20 rounded-xl">
                  Secure transaction logs are managed here.
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
