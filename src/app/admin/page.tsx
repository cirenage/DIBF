
"use client";

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
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
  Sparkles
} from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('initiatives');
  const [isAdding, setIsAdding] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Queries
  const initiativesRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const { data: initiatives, loading: loadingInitiatives } = useCollection(initiativesRef);

  const newsRef = useMemoFirebase(() => db ? collection(db, 'news') : null, [db]);
  const { data: news, loading: loadingNews } = useCollection(newsRef ? query(newsRef, orderBy('date', 'desc')) : null);

  const storiesRef = useMemoFirebase(() => db ? collection(db, 'impactStories') : null, [db]);
  const { data: stories, loading: loadingStories } = useCollection(storiesRef);

  const partnersRef = useMemoFirebase(() => db ? collection(db, 'partners') : null, [db]);
  const { data: partners, loading: loadingPartners } = useCollection(partnersRef);

  const donationsRef = useMemoFirebase(() => db ? collection(db, 'donations') : null, [db]);
  const { data: donations, loading: loadingDonations } = useCollection(donationsRef);

  const getSampleData = (type: string) => {
    switch(type) {
      case 'initiatives':
        return {
          title: "The Tinewonsa Project",
          description: "Revolutionizing primary healthcare delivery in rural Africa through community-led clinical hubs.",
          category: "Healthcare Delivery",
          imageUrl: `https://picsum.photos/seed/tinewonsa/600/400`,
          active: true,
          createdAt: serverTimestamp(),
        };
      case 'news':
        return {
          title: "Expansion into East Africa",
          content: "We are excited to announce our new partnership for the Kenya Health Initiative.",
          date: new Date().toISOString().split('T')[0],
          author: "DIBF Communications",
        };
      case 'impactStories':
        return {
          name: "Amara Okoro",
          story: "The medical scholarship from DIBF allowed me to complete my residency and return to serve my village.",
          location: "Enugu, Nigeria",
        };
      case 'partners':
        return {
          name: "Global Health Alliance",
          type: "NGO",
        };
      case 'donations':
        return {
          donorName: "John Smith",
          amount: 250,
          timestamp: new Date().toISOString(),
          program: "Dollar-A-Day Campaign",
        };
      default:
        return {};
    }
  };

  const seedAllCollections = async () => {
    if (!db) return;
    setIsSeeding(true);
    const collectionsToSeed = ['initiatives', 'news', 'impactStories', 'partners', 'donations'];
    
    try {
      for (const colName of collectionsToSeed) {
        const ref = collection(db, colName);
        const data = getSampleData(colName);
        await addDoc(ref, data);
      }
      toast({ title: "Database Seeded", description: "Sample records added to all collections." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Seeding Failed", description: err.message || "Check your Security Rules." });
    } finally {
      setIsSeeding(false);
    }
  };

  const addSampleData = () => {
    if (!db) return;
    setIsAdding(true);

    const ref = collection(db, activeTab);
    const data = getSampleData(activeTab);

    addDoc(ref, data)
      .then(() => {
        toast({ title: "Success", description: `Added a sample to ${activeTab}` });
      })
      .catch(async (err) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: ref.path,
          operation: 'create',
          requestResourceData: data,
        }));
      })
      .finally(() => setIsAdding(false));
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Explorer
          </h1>
          <p className="text-muted-foreground mt-1">Manage your Firebase collections in real-time.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={seedAllCollections} 
            disabled={isSeeding || !db}
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Seed All Collections
          </Button>
          <Button onClick={addSampleData} disabled={isAdding || !db} className="gap-2">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Sample {activeTab}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="initiatives" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 p-1 bg-muted rounded-xl">
          <TabsTrigger value="initiatives" className="gap-2"><LayoutGrid className="w-4 h-4" /> Initiatives</TabsTrigger>
          <TabsTrigger value="news" className="gap-2"><FileText className="w-4 h-4" /> News</TabsTrigger>
          <TabsTrigger value="impactStories" className="gap-2"><Heart className="w-4 h-4" /> Impact Stories</TabsTrigger>
          <TabsTrigger value="partners" className="gap-2"><Handshake className="w-4 h-4" /> Partners</TabsTrigger>
          <TabsTrigger value="donations" className="gap-2"><DollarSign className="w-4 h-4" /> Donations</TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <CollectionTable 
            data={initiatives} 
            loading={loadingInitiatives}
            columns={['Title', 'Category', 'Status']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell>{item.active ? "Active" : "Inactive"}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="news">
          <CollectionTable 
            data={news} 
            loading={loadingNews}
            columns={['Date', 'Title', 'Author']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell>{item.date}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell>{item.author}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="impactStories">
          <CollectionTable 
            data={stories} 
            loading={loadingStories}
            columns={['Name', 'Location', 'Story Preview']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="max-w-xs overflow-hidden text-ellipsis whitespace-nowrap italic">
                  "{item.story}"
                </TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="partners">
          <CollectionTable 
            data={partners} 
            loading={loadingPartners}
            columns={['Partner Name', 'Type']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell><Badge>{item.type}</Badge></TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="donations">
          <CollectionTable 
            data={donations} 
            loading={loadingDonations}
            columns={['Donor', 'Amount', 'Program']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.donorName}</TableCell>
                <TableCell className="text-green-600 font-bold">${item.amount}</TableCell>
                <TableCell>{item.program}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CollectionTable({ data, loading, columns, renderRow }: any) {
  return (
    <Card className="shadow-xl">
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-10"><RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" /></div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 opacity-20" />
            <p>No records found in this collection. Click "Add Sample" to begin.</p>
          </div>
        ) : (
          <Table>
            <TableHeader><TableRow>{columns.map((col: string) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader>
            <TableBody>{data.map(renderRow)}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
