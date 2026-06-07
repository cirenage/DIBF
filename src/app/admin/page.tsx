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
  Info
} from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
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
  const donationsRef = useMemoFirebase(() => db ? collection(db, 'donations') : null, [db]);

  // Memoized Queries to prevent infinite render loops
  const newsQuery = useMemoFirebase(() => {
    if (!newsRef) return null;
    return query(newsRef, orderBy('date', 'desc'));
  }, [newsRef]);

  // Data Subscriptions
  const { data: initiatives, loading: loadingInitiatives, error: errorInitiatives } = useCollection(initiativesRef);
  const { data: news, loading: loadingNews, error: errorNews } = useCollection(newsQuery);
  const { data: stories, loading: loadingStories, error: errorStories } = useCollection(storiesRef);
  const { data: partners, loading: loadingPartners, error: errorPartners } = useCollection(partnersRef);
  const { data: donations, loading: loadingDonations, error: errorDonations } = useCollection(donationsRef);

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

  /**
   * Helper to perform a timeout-safe operation
   */
  async function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T> {
    let timeoutHandle: any;
    const timeout = new Promise<never>((_, reject) => {
      timeoutHandle = setTimeout(() => reject(new Error("TIMEOUT")), timeoutMs);
    });
    
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(timeoutHandle);
    }
  }

  /**
   * Check if a collection has any records
   */
  async function collectionHasData(firestore: Firestore, colName: string): Promise<boolean> {
    try {
      const colRef = collection(firestore, colName);
      const q = query(colRef, limit(1));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err: any) {
      // Re-throw permission errors specifically
      if (err.code === 'permission-denied') throw err;
      return false;
    }
  }

  const seedAllCollections = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    // Seed CMS collections only. Donations are restricted.
    const collectionsToSeed = ['initiatives', 'news', 'impactStories', 'partners'];
    const results = { seeded: [] as string[], skipped: [] as string[], failed: [] as string[] };

    try {
      for (const colName of collectionsToSeed) {
        try {
          const exists = await withTimeout(collectionHasData(db, colName));
          if (exists) {
            results.skipped.push(colName);
            continue;
          }

          const ref = collection(db, colName);
          const data = getSampleData(colName);
          await addDoc(ref, data);
          results.seeded.push(colName);
        } catch (err: any) {
          console.error(`Failed to seed ${colName}:`, err);
          if (err.code === 'permission-denied') {
            results.failed.push(`${colName} (Permission Denied)`);
          } else if (err.message === 'TIMEOUT') {
            results.failed.push(`${colName} (Timeout)`);
          } else {
            results.failed.push(colName);
          }
        }
      }

      if (results.seeded.length > 0) {
        toast({ 
          title: "Seeding complete", 
          description: `Seeded: ${results.seeded.join(', ')}. Skipped: ${results.skipped.length}. Failed: ${results.failed.length}.` 
        });
      } else if (results.failed.length > 0) {
        toast({ 
          variant: "destructive",
          title: "Seeding issues", 
          description: `Failed: ${results.failed.join(', ')}.` 
        });
      } else {
        toast({ title: "Already up to date", description: "No new collections needed seeding." });
      }

    } finally {
      setIsSeeding(false);
    }
  };

  const addSampleData = async () => {
    if (!db) return;
    
    if (activeTab === 'donations') {
      toast({ 
        variant: "destructive", 
        title: "Restricted Access", 
        description: "Donations are restricted for security and cannot be seeded from the admin client." 
      });
      return;
    }

    setIsAdding(true);
    const ref = collection(db, activeTab);
    const data = getSampleData(activeTab);

    try {
      const exists = await withTimeout(collectionHasData(db, activeTab));
      if (exists) {
        toast({ title: "Seeded already", description: `The ${activeTab} collection already has data.` });
        setIsAdding(false);
        return;
      }

      await withTimeout(addDoc(ref, data));
      toast({ title: "Success", description: `Added sample to ${activeTab}` });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'permission-denied') {
        toast({ 
          variant: "destructive", 
          title: "Permission Denied", 
          description: `Firestore permission denied for ${activeTab}. Check your security rules.` 
        });
      } else if (err.message === "TIMEOUT") {
        toast({ 
          variant: "destructive", 
          title: "Request Timeout", 
          description: "Operation took too long. Check your network or Firebase configuration." 
        });
      } else {
        toast({ 
          variant: "destructive", 
          title: "Operation Failed", 
          description: err.message || "An unexpected error occurred." 
        });
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Explorer
          </h1>
          <p className="text-muted-foreground mt-1">Manage your CMS collections and verify database connectivity.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={seedAllCollections} 
            disabled={isSeeding || !db}
            className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
          >
            {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Seed CMS Content
          </Button>
          <Button onClick={addSampleData} disabled={isAdding || !db} className="gap-2">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add {activeTab}
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
            error={errorInitiatives}
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
            error={errorNews}
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
            error={errorStories}
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
            error={errorPartners}
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
          <div className="space-y-4">
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4" />
              <AlertTitle className="font-bold">Restricted Collection</AlertTitle>
              <AlertDescription>
                Donations are restricted for security and are not seeded or listed from the public admin client. 
                Please use the Firebase Console for sensitive data management.
              </AlertDescription>
            </Alert>
            <CollectionTable 
              data={donations} 
              loading={loadingDonations}
              error={errorDonations}
              columns={['Donor', 'Amount', 'Program']}
              renderRow={(item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.donorName}</TableCell>
                  <TableCell className="text-green-600 font-bold">${item.amount}</TableCell>
                  <TableCell>{item.program}</TableCell>
                </TableRow>
              )}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CollectionTable({ data, loading, error, columns, renderRow }: any) {
  if (error && error.code === 'permission-denied') {
    return (
      <Card className="border-destructive/20 bg-destructive/5">
        <CardContent className="pt-6 flex flex-col items-center py-12 gap-4 text-center">
          <ShieldAlert className="w-12 h-12 text-destructive" />
          <div className="space-y-1">
            <h3 className="font-bold text-destructive">Permission Denied</h3>
            <p className="text-sm text-destructive/80">
              Firestore security rules restrict read access to this collection.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardContent className="pt-6">
        {loading ? (
          <div className="flex justify-center py-10"><RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" /></div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
            <AlertCircle className="w-8 h-8 opacity-20" />
            <p>No records found. Click "Add Sample" to populate.</p>
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
