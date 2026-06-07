"use client";

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  getDocs, 
  limit, 
  Firestore 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Plus, 
  Loader2, 
  RefreshCcw, 
  AlertCircle, 
  FileText, 
  Heart, 
  LayoutGrid,
  Users,
  Handshake,
  DollarSign,
  Sparkles,
  ShieldAlert,
  Info,
  Calendar,
  Image as ImageIcon,
  HelpCircle,
  TrendingUp,
  BookOpen
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('initiatives');
  const [isAdding, setIsAdding] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Memoized Base Collection References
  const initiativesRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const newsRef = useMemoFirebase(() => db ? collection(db, 'news') : null, [db]);
  const storiesRef = useMemoFirebase(() => db ? collection(db, 'impactStories') : null, [db]);
  const partnersRef = useMemoFirebase(() => db ? collection(db, 'partners') : null, [db]);
  const eventsRef = useMemoFirebase(() => db ? collection(db, 'events') : null, [db]);
  const teamRef = useMemoFirebase(() => db ? collection(db, 'teamMembers') : null, [db]);
  const publicationsRef = useMemoFirebase(() => db ? collection(db, 'publications') : null, [db]);
  const galleryRef = useMemoFirebase(() => db ? collection(db, 'gallery') : null, [db]);
  const faqsRef = useMemoFirebase(() => db ? collection(db, 'faqs') : null, [db]);
  const statsRef = useMemoFirebase(() => db ? collection(db, 'impactStats') : null, [db]);

  // Data Subscriptions
  const { data: initiatives, loading: loadingInitiatives } = useCollection(initiativesRef);
  const { data: news, loading: loadingNews } = useCollection(newsRef);
  const { data: stories, loading: loadingStories } = useCollection(storiesRef);
  const { data: partners, loading: loadingPartners } = useCollection(partnersRef);
  const { data: events, loading: loadingEvents } = useCollection(eventsRef);
  const { data: team, loading: loadingTeam } = useCollection(teamRef);
  const { data: gallery, loading: loadingGallery } = useCollection(galleryRef);
  const { data: faqs, loading: loadingFaqs } = useCollection(faqsRef);
  const { data: stats, loading: loadingStats } = useCollection(statsRef);
  const { data: publications, loading: loadingPublications } = useCollection(publicationsRef);

  const getSampleData = (type: string): any[] => {
    switch(type) {
      case 'initiatives':
        return [
          { title: "The Tinewonsa Project", slug: "tinewonsa", category: "Medical Outreach", description: "Revolutionizing primary healthcare delivery in rural Africa.", featured: true, published: true, imageUrl: "https://picsum.photos/seed/tinewonsa/600/400" },
          { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", category: "Sustainable Giving", description: "Micro-philanthropy for essential medical supplies.", featured: true, published: true, imageUrl: "https://picsum.photos/seed/dollar/600/400" },
          { title: "African Field School", slug: "field-school", category: "Business & Leadership", description: "Practical medical education for international students.", featured: true, published: true, imageUrl: "https://picsum.photos/seed/school/600/400" },
          { title: "Maternal Health Initiative", slug: "maternal-health", category: "Women’s Health", description: "Supporting mothers with prenatal and postnatal care.", featured: false, published: true, imageUrl: "https://picsum.photos/seed/women/600/400" },
          { title: "Youth Mental Health Hub", slug: "youth-mental-health", category: "Youth Development", description: "Safe spaces and counseling for young people.", featured: false, published: true, imageUrl: "https://picsum.photos/seed/mental/600/400" },
          { title: "Community Water Access", slug: "water-access", category: "Community Support", description: "Providing clean water to remote clinical hubs.", featured: false, published: true, imageUrl: "https://picsum.photos/seed/water/600/400" }
        ];
      case 'news':
        return [
          { title: "Expanding to Kenya", slug: "expanding-kenya", author: "DIBF Team", excerpt: "New clinical hubs opening in Nairobi's outskirts.", content: "Full content here...", published: true, imageUrl: "https://picsum.photos/seed/kenya/600/400" },
          { title: "Annual Impact Report 2023", slug: "report-2023", author: "Director", excerpt: "Over 15,000 lives impacted this year.", content: "Full content here...", published: true, imageUrl: "https://picsum.photos/seed/report/600/400" },
          { title: "New Partnership with Global Health", slug: "partnership-global", author: "Comms", excerpt: "Joining forces for sustainable healthcare.", content: "Full content here...", published: true, imageUrl: "https://picsum.photos/seed/collab/600/400" }
        ];
      case 'impactStories':
        return [
          { beneficiaryName: "Grace Mensah", location: "Accra, Ghana", story: "The mobile clinic saved my child's life during the malaria outbreak.", title: "A Mother's Gratitude", featured: true, published: true, imageUrl: "https://picsum.photos/seed/grace/600/400" },
          { beneficiaryName: "Kofi Owusu", location: "Kumasi, Ghana", story: "I learned how to manage my diabetes through DIBF education programs.", title: "Living Better", featured: true, published: true, imageUrl: "https://picsum.photos/seed/kofi/600/400" }
        ];
      case 'partners':
        return [
          { name: "University of Ghana", partnerType: "University", website: "https://ug.edu.gh", description: "Academic and research partner.", logoUrl: "https://picsum.photos/seed/ug/200/200" },
          { name: "MedTech Global", partnerType: "Corporate", website: "https://medtech.com", description: "Medical equipment sponsor.", logoUrl: "https://picsum.photos/seed/medtech/200/200" }
        ];
      case 'events':
        return [
          { title: "DIBF Global Gala 2024", slug: "gala-2024", date: "2024-12-15", location: "London, UK", status: "upcoming", description: "Our annual fundraising event.", imageUrl: "https://picsum.photos/seed/gala/600/400" },
          { title: "Rural Outreach: Volta Region", slug: "volta-2024", date: "2024-10-20", location: "Volta, Ghana", status: "upcoming", description: "Medical outreach for 500+ residents.", imageUrl: "https://picsum.photos/seed/volta/600/400" }
        ];
      case 'teamMembers':
        return [
          { name: "Dr. Jane Smith", role: "Executive Director", bio: "Medical expert with 15 years in global health.", order: 1, imageUrl: "https://picsum.photos/seed/jane/400/400" },
          { name: "John Mensah", role: "Head of Operations", bio: "Logistics specialist in rural development.", order: 2, imageUrl: "https://picsum.photos/seed/john/400/400" }
        ];
      case 'impactStats':
        return [
          { label: "Lives Impacted", value: "15,000+", icon: "Heart" },
          { label: "Clinical Hubs", value: "45+", icon: "Hospital" }
        ];
      case 'gallery':
        return [
          { title: "Medical Mission Accra", category: "Events", imageUrl: "https://picsum.photos/seed/mission1/800/600" },
          { title: "Clinical Hub Launch", category: "Outreach", imageUrl: "https://picsum.photos/seed/launch/800/600" }
        ];
      case 'faqs':
        return [
          { question: "How can I volunteer?", answer: "Apply via our Get Involved page.", category: "Volunteering", order: 1 }
        ];
      case 'publications':
        return [
          { title: "Health Equity Report 2023", category: "Research", description: "Insights into rural health delivery.", publishedAt: "2023-11-01", fileUrl: "#" }
        ];
      default:
        return [];
    }
  };

  async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
    const timeout = new Promise<never>((_, reject) => setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs));
    return Promise.race([promise, timeout]);
  }

  const seedCollection = async (colName: string): Promise<{ status: 'seeded' | 'skipped' | 'failed', count: number }> => {
    if (!db) return { status: 'failed', count: 0 };
    
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(query(colRef, limit(1)));
      
      if (!snapshot.empty) {
        return { status: 'skipped', count: 0 };
      }

      const samples = getSampleData(colName);
      let count = 0;
      for (const item of samples) {
        await addDoc(colRef, { ...item, createdAt: serverTimestamp() });
        count++;
      }
      return { status: 'seeded', count };
    } catch (err: any) {
      console.error(`Error seeding ${colName}:`, err);
      return { status: 'failed', count: 0 };
    }
  };

  const seedAllCollections = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    const collectionsToSeed = [
      'initiatives', 'news', 'impactStories', 'partners', 
      'events', 'teamMembers', 'impactStats', 'gallery', 'faqs', 'publications'
    ];
    
    const results = { seeded: [] as string[], skipped: [] as string[], failed: [] as string[] };

    try {
      await withTimeout((async () => {
        for (const colName of collectionsToSeed) {
          const res = await seedCollection(colName);
          if (res.status === 'seeded') results.seeded.push(`${colName} (${res.count})`);
          else if (res.status === 'skipped') results.skipped.push(colName);
          else results.failed.push(colName);
        }
      })());

      toast({ 
        title: "Seed Summary", 
        description: `Seeded: ${results.seeded.length || 0}. Skipped: ${results.skipped.length || 0}. Failed: ${results.failed.length || 0}.` 
      });
    } catch (err: any) {
      toast({ 
        variant: "destructive",
        title: err.message === "TIMEOUT" ? "Seeding Timeout" : "Seeding Failed", 
        description: "Operation took too long or encountered a security restriction. Check Firestore rules." 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  const addSampleData = async () => {
    if (!db) return;
    setIsAdding(true);
    try {
      const res = await seedCollection(activeTab);
      if (res.status === 'seeded') toast({ title: "Success", description: `Added ${res.count} items to ${activeTab}` });
      else if (res.status === 'skipped') toast({ title: "Already Populated", description: `${activeTab} already has data.` });
      else toast({ variant: "destructive", title: "Failed", description: `Could not add data to ${activeTab}. Ensure Firestore rules allow writes.` });
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Explorer
          </h1>
          <p className="text-muted-foreground mt-2">Manage your CMS collections and sync realistic sample data to your live project.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline" 
            onClick={seedAllCollections} 
            disabled={isSeeding || !db}
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5 h-12 px-6"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Seed All Collections
          </Button>
          <Button onClick={addSampleData} disabled={isAdding || !db} className="gap-2 h-12 px-6">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Populate {activeTab}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="initiatives" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 p-1.5 bg-muted rounded-xl justify-start">
          <TabsTrigger value="initiatives" className="gap-2"><LayoutGrid className="w-4 h-4" /> Initiatives</TabsTrigger>
          <TabsTrigger value="news" className="gap-2"><FileText className="w-4 h-4" /> News</TabsTrigger>
          <TabsTrigger value="events" className="gap-2"><Calendar className="w-4 h-4" /> Events</TabsTrigger>
          <TabsTrigger value="impactStories" className="gap-2"><Heart className="w-4 h-4" /> Impact Stories</TabsTrigger>
          <TabsTrigger value="partners" className="gap-2"><Handshake className="w-4 h-4" /> Partners</TabsTrigger>
          <TabsTrigger value="teamMembers" className="gap-2"><Users className="w-4 h-4" /> Team</TabsTrigger>
          <TabsTrigger value="gallery" className="gap-2"><ImageIcon className="w-4 h-4" /> Gallery</TabsTrigger>
          <TabsTrigger value="faqs" className="gap-2"><HelpCircle className="w-4 h-4" /> FAQs</TabsTrigger>
          <TabsTrigger value="impactStats" className="gap-2"><TrendingUp className="w-4 h-4" /> Stats</TabsTrigger>
          <TabsTrigger value="publications" className="gap-2"><BookOpen className="w-4 h-4" /> Publications</TabsTrigger>
          <TabsTrigger value="donations" className="gap-2"><DollarSign className="w-4 h-4" /> Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <CollectionTable 
            data={initiatives} 
            loading={loadingInitiatives}
            columns={['Title', 'Category', 'Status']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                <TableCell><Badge variant={item.published ? "default" : "outline"}>{item.published ? "Published" : "Draft"}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="news">
          <CollectionTable 
            data={news} 
            loading={loadingNews}
            columns={['Title', 'Author', 'Status']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell><Badge>{item.published ? "Active" : "Draft"}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="events">
          <CollectionTable 
            data={events} 
            loading={loadingEvents}
            columns={['Date', 'Event Title', 'Location', 'Status']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono">{item.date}</TableCell>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell><Badge variant={item.status === 'upcoming' ? 'default' : 'secondary'}>{item.status}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="impactStories">
          <CollectionTable 
            data={stories} 
            loading={loadingStories}
            columns={['Beneficiary', 'Location', 'Story Preview']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold text-primary">{item.beneficiaryName}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="italic text-sm line-clamp-1">"{item.story}"</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="partners">
          <CollectionTable 
            data={partners} 
            loading={loadingPartners}
            columns={['Organization', 'Type', 'Website']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell><Badge variant="outline">{item.partnerType}</Badge></TableCell>
                <TableCell className="text-primary underline text-xs">{item.website}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="teamMembers">
          <CollectionTable 
            data={team} 
            loading={loadingTeam}
            columns={['Name', 'Role', 'Order']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{item.role}</TableCell>
                <TableCell>{item.order}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="gallery">
          <CollectionTable 
            data={gallery} 
            loading={loadingGallery}
            columns={['Title', 'Category']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell><Badge>{item.category}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="faqs">
          <CollectionTable 
            data={faqs} 
            loading={loadingFaqs}
            columns={['Question', 'Category']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.question}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="impactStats">
          <CollectionTable 
            data={stats} 
            loading={loadingStats}
            columns={['Label', 'Value']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.label}</TableCell>
                <TableCell className="text-primary font-bold">{item.value}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="publications">
          <CollectionTable 
            data={publications} 
            loading={loadingPublications}
            columns={['Title', 'Category', 'Date']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.title}</TableCell>
                <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                <TableCell className="font-mono text-xs">{item.publishedAt}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="donations">
          <div className="space-y-4">
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-bold">Restricted Collection</AlertTitle>
              <AlertDescription>
                Donation records are highly sensitive and restricted for security. They cannot be publicly seeded or listed here for production safety.
              </AlertDescription>
            </Alert>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CollectionTable({ data, loading, columns, renderRow }: any) {
  return (
    <Card className="shadow-xl border-none">
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <RefreshCcw className="w-10 h-10 animate-spin text-primary opacity-20" />
            <p className="text-muted-foreground text-sm animate-pulse">Fetching collection data...</p>
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 opacity-10" />
            <div className="space-y-1">
              <h3 className="font-bold text-secondary">No Data Found</h3>
              <p className="text-sm">Click the populate button to add sample records for this collection.</p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader><TableRow className="bg-muted/50">{columns.map((col: string) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{data.map(renderRow)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}