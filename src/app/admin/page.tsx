"use client";

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  ExternalLink,
  Users,
  Handshake,
  DollarSign
} from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('initiatives');
  const [isAdding, setIsAdding] = React.useState(false);

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

  const addSampleData = () => {
    if (!db) return;
    setIsAdding(true);

    const ref = collection(db, activeTab);
    let data = {};

    switch(activeTab) {
      case 'initiatives':
        data = {
          title: "New Health Initiative",
          description: "Providing essential medical care to rural communities.",
          category: "Healthcare",
          imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
          active: true,
          createdAt: serverTimestamp(),
        };
        break;
      case 'news':
        data = {
          title: "Annual Impact Report",
          content: "We've reached over 10,000 community members this year.",
          date: new Date().toISOString().split('T')[0],
          author: "DIBF Team",
        };
        break;
      case 'impactStories':
        data = {
          name: "Amara",
          story: "The scholarship changed my life and allowed me to pursue my dreams.",
          location: "Nairobi",
        };
        break;
      case 'partners':
        data = {
          name: "Global Health Foundation",
          type: "Foundation",
        };
        break;
      case 'donations':
        data = {
          donorName: "Anonymous",
          amount: 100,
          timestamp: new Date().toISOString(),
          program: "General Fund",
        };
        break;
    }

    addDoc(ref, data)
      .then(() => {
        toast({ title: "Success", description: `Added to ${activeTab}` });
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
        <Button onClick={addSampleData} disabled={isAdding || !db} className="gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Sample {activeTab}
        </Button>
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
                <TableCell className="truncate max-w-xs">"{item.story}"</TableCell>
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
          <div className="text-center py-10 text-muted-foreground">No records found. Add a sample to begin.</div>
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