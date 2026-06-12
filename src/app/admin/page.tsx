
"use client";

import * as React from 'react';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, addDoc, setDoc, doc, serverTimestamp, getDocs, query, limit, where, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Database, Users, Mail, Send, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateNewsletterDraft } from '@/ai/flows/generate-newsletter-draft';

export default function AdminHub() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [isDrafting, setIsDrafting] = React.useState(false);
  const [draft, setDraft] = React.useState<{ subjectLine: string; body: string } | null>(null);

  // Subscribers Query
  const subsQuery = useMemoFirebase(() => db ? query(collection(db, 'newsletterSubscriptions'), orderBy('subscribedAt', 'desc')) : null, [db]);
  const { data: subscribers } = useCollection(subsQuery);

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);
    let seeded = 0;

    try {
      // 1. Hero Slides
      const heroSlides = [
        {
          order: 1,
          eyebrow: "Healing Communities. Empowering Futures.",
          heading: "Advancing Health, Human Dignity, and Sustainable Development",
          body: "DIBF is the nonprofit and social impact arm of Doctors in Business Global.",
          imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1920",
          primaryCTA: "Support Our Work", primaryLink: "/get-involved", secondaryCTA: "Explore Initiatives", secondaryLink: "/initiatives"
        }
      ];
      for (const slide of heroSlides) {
        await addDoc(collection(db, 'heroSlides'), { ...slide, createdAt: serverTimestamp() });
        seeded++;
      }

      // 2. Site Content
      const content = [
        { id: 'partnership', title: "Stronger Together. Greater Impact.", description: "Partner with us to build resilient communities.", imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=1200" },
        { id: 'storeTeaser', title: "Shop With Purpose.", description: "Every purchase supports initiatives for lasting impact.", imageUrl: "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=1200" },
        { id: 'aboutWhoWeAre', title: "Who We Are", subtitle: "Advancing health equity and human dignity.", description: "DIBF transforms shared responsibility into action.", imageUrl: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&q=80&w=1200" }
      ];
      for (const c of content) {
        await setDoc(doc(db, 'siteContent', c.id), { ...c, updatedAt: serverTimestamp() }, { merge: true });
        seeded++;
      }

      toast({ title: "Seed Complete", description: `Added ${seeded} records.` });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDraftNewsletter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDrafting(true);
    const formData = new FormData(e.currentTarget);
    try {
      const result = await generateNewsletterDraft({
        topic: formData.get('topic') as string,
        recentHighlights: formData.get('highlights') as string,
      });
      setDraft(result);
      toast({ title: "Draft Generated", description: "Your newsletter draft is ready below." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to generate draft." });
    } finally {
      setIsDrafting(false);
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
          <p className="text-muted-foreground mt-2">Manage DIBF dynamic content and community engagement.</p>
        </div>
        <Button onClick={seedDatabase} disabled={isSeeding} size="lg" className="gap-2 font-bold rounded-full">
          {isSeeding ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl h-12">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers ({subscribers.length})</TabsTrigger>
          <TabsTrigger value="newsletter">Newsletter AI</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <Card><CardHeader><CardTitle className="text-sm">Total Subscribers</CardTitle></CardHeader><CardContent className="text-3xl font-bold">{subscribers.length}</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Active Initiatives</CardTitle></CardHeader><CardContent className="text-3xl font-bold">4</CardContent></Card>
             <Card><CardHeader><CardTitle className="text-sm">Impact Store Items</CardTitle></CardHeader><CardContent className="text-3xl font-bold">9</CardContent></Card>
          </div>
        </TabsContent>

        <TabsContent value="subscribers">
          <Card className="border-none shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-primary" />
                Community Mailing List
              </CardTitle>
              <CardDescription>View all users who have subscribed via the footer.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y">
                {subscribers.map((sub) => (
                  <div key={sub.id} className="py-4 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-secondary">{sub.email}</p>
                      <p className="text-xs text-muted-foreground">Joined: {sub.subscribedAt?.toDate().toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">Active</span>
                  </div>
                ))}
                {subscribers.length === 0 && <p className="text-center py-10 text-muted-foreground">No subscribers yet.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="newsletter">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Newsletter Drafter
                </CardTitle>
                <CardDescription>Generate a draft to send to your community.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDraftNewsletter} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Main Topic</label>
                    <Input name="topic" placeholder="e.g., Progress on the Tinewonsa Project" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">Recent Highlights</label>
                    <Textarea name="highlights" placeholder="e.g., Opened a new clinic in Kumasi, served 500 patients last month." className="min-h-[120px]" required />
                  </div>
                  <Button type="submit" disabled={isDrafting} className="w-full h-12 gap-2">
                    {isDrafting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate Draft with AI
                  </Button>
                </form>
              </CardContent>
            </Card>

            {draft && (
              <Card className="border-none shadow-xl bg-primary/5 animate-in zoom-in-95">
                <CardHeader>
                  <CardTitle className="text-lg">Draft Output</CardTitle>
                  <CardDescription>Copy this into your email marketing tool.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">Subject Line</label>
                    <p className="p-3 bg-white rounded border font-bold">{draft.subjectLine}</p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase text-muted-foreground">Body Content</label>
                    <div className="p-4 bg-white rounded border text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto italic font-body">
                      {draft.body}
                    </div>
                  </div>
                  <Button variant="outline" className="w-full gap-2" onClick={() => {
                    navigator.clipboard.writeText(`Subject: ${draft.subjectLine}\n\n${draft.body}`);
                    toast({ title: "Copied", description: "Draft copied to clipboard." });
                  }}>
                    <FileText className="w-4 h-4" />
                    Copy All Content
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
