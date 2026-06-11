
"use client";

import * as React from 'react';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { collection, doc, setDoc, addDoc, serverTimestamp, getDocs, query, limit, where } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Sparkles, Database, ShoppingCart, Users, Heart, Globe, Newspaper, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Collection References
  const initsRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const storeRef = useMemoFirebase(() => db ? collection(db, 'impactStore') : null, [db]);
  const newsRef = useMemoFirebase(() => db ? collection(db, 'news') : null, [db]);
  const eventsRef = useMemoFirebase(() => db ? collection(db, 'events') : null, [db]);

  const { data: initiatives } = useCollection(initsRef);
  const { data: storeItems } = useCollection(storeRef);

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);

    const timeout = setTimeout(() => {
      setIsSeeding(false);
      toast({ variant: "destructive", title: "Timeout", description: "Seeding took too long. Check network/rules." });
    }, 15000);

    try {
      // 1. Impact Store Seeding (Comprehensive Categories)
      const storeItemsData = [
        {
          title: "Mental Resilience Journal",
          description: "A guided 90-day journal for reflection and emotional wellbeing.",
          price: "$25.00",
          category: "Mental health awareness merchandise",
          imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800",
          impactNote: "Directly funds youth counseling sessions.",
          order: 1
        },
        {
          title: "DIBF Unity Hoodie",
          description: "Heavyweight cotton hoodie with embroidered foundation emblem.",
          price: "$55.00",
          category: "Apparel and accessories",
          imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800",
          impactNote: "Contributes to mobile clinic fuel and logistics.",
          order: 2
        },
        {
          title: "Eco-Bamboo Desk Set",
          description: "Sustainable bamboo office accessories for the conscious professional.",
          price: "$40.00",
          category: "Office and lifestyle items",
          imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800",
          impactNote: "Supports public health education workshops.",
          order: 3
        },
        {
          title: "Wellness Hydration Bottle",
          description: "Insulated stainless steel bottle to keep you hydrated on the go.",
          price: "$30.00",
          category: "Wellness and fitness products",
          imageUrl: "https://images.unsplash.com/photo-1602143307185-84487493375e?auto=format&fit=crop&q=80&w=800",
          impactNote: "Funds clean water filters for rural clinics.",
          order: 4
        },
        {
          title: "Dollar-A-Day Campaign Band",
          description: "Silicon awareness wristband representing collective generosity.",
          price: "$5.00",
          category: "Awareness campaigns and themed collections",
          imageUrl: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&q=80&w=800",
          impactNote: "Goes towards the cancer care fund.",
          order: 5
        },
        {
          title: "Hand-Woven Community Basket",
          description: "Traditional African basket crafted by local women's cooperatives.",
          price: "$65.00",
          category: "Creative and artistic pieces",
          imageUrl: "https://images.unsplash.com/photo-1596464716127-f2a82984de30?auto=format&fit=crop&q=80&w=800",
          impactNote: "Supports sustainable income for local artisans.",
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

      // 2. Initiatives Seeding
      const initiativesData = [
        {
          title: "The Tinewonsa Project",
          slug: "tinewonsa",
          summary: "Fostering a culture of sustainable giving and collective responsibility.",
          description: "Providing meaningful opportunities for communities to contribute toward causes that improve lives and create lasting social impact.",
          category: "Community Support",
          imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=800",
          featured: true,
          order: 1
        },
        {
          title: "Dollar-A-Day Campaign",
          slug: "dollar-a-day",
          summary: "The power of collective generosity in healthcare.",
          description: "A micro-giving model supporting long-term healthcare priorities including cancer care, research, and life-saving treatment access.",
          category: "Health Equity",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800",
          featured: true,
          order: 2
        },
        {
          title: "African Field School",
          slug: "field-school",
          summary: "Experiential learning and cultural exchange platform.",
          description: "Immersive community-centered experiences bringing together students and global partners for service and engagement across Africa.",
          category: "Education",
          imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
          featured: true,
          order: 3
        }
      ];

      for (const item of initiativesData) {
        const q = query(collection(db, 'initiatives'), where('slug', '==', item.slug), limit(1));
        const snap = await getDocs(q);
        if (snap.empty) {
          await addDoc(collection(db, 'initiatives'), { ...item, createdAt: serverTimestamp() });
        }
      }

      toast({ title: "Success", description: "Database seeded successfully!" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      clearTimeout(timeout);
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
          Seed All Website Data
        </Button>
      </div>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-12">
          <TabsTrigger value="store" className="px-6">Impact Store</TabsTrigger>
          <TabsTrigger value="initiatives" className="px-6">Initiatives</TabsTrigger>
          <TabsTrigger value="submissions" className="px-6">Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
              <div>
                <CardTitle>Impact Store Catalog</CardTitle>
                <CardDescription>Items available in the purpose-driven store.</CardDescription>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary/20" />
            </CardHeader>
            <CardContent className="pt-6">
              {storeItems.length === 0 ? (
                <div className="text-center py-20 italic text-muted-foreground border-2 border-dashed rounded-xl">
                  No products found. Click "Seed All Website Data" to populate the catalog.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storeItems.map((item: any) => (
                    <div key={item.id} className="flex flex-col p-4 border rounded-xl bg-muted/20">
                      <div className="w-full h-40 relative rounded-lg overflow-hidden mb-4 border bg-white">
                        <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
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

        <TabsContent value="initiatives">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Featured Initiatives</CardTitle>
              <CardDescription>Programs displayed on the public site.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initiatives.map((init: any) => (
                  <div key={init.id} className="p-4 border rounded-xl">
                    <h4 className="font-bold text-secondary">{init.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{init.summary}</p>
                  </div>
                ))}
              </div>
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
