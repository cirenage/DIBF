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
  Trash2
} from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('initiatives');
  const [isAdding, setIsAdding] = React.useState(false);

  // Initiatives Query
  const initiativesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'initiatives');
  }, [db]);
  const { data: initiatives, loading: loadingInitiatives } = useCollection(initiativesRef);

  // News Query
  const newsRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'news');
  }, [db]);
  const { data: news, loading: loadingNews } = useCollection(newsRef ? query(newsRef, orderBy('date', 'desc')) : null);

  // Impact Stories Query
  const storiesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'impact-stories');
  }, [db]);
  const { data: stories, loading: loadingStories } = useCollection(storiesRef);

  const addSampleData = () => {
    if (!db) return;
    setIsAdding(true);

    const path = activeTab === 'stories' ? 'impact-stories' : activeTab;
    const ref = collection(db, path);
    
    let data = {};
    if (activeTab === 'initiatives') {
      data = {
        title: "Community Health Hub " + (initiatives.length + 1),
        description: "New clinical site providing essential maternal care and primary health services.",
        category: "Healthcare",
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        active: true,
        createdAt: serverTimestamp(),
      };
    } else if (activeTab === 'news') {
      data = {
        title: "Quarterly Impact Report Released",
        content: "We are proud to share our progress for the current quarter, highlighting significant gains in maternal health and youth programs.",
        date: new Date().toISOString().split('T')[0],
        author: "DIBF Communications",
        imageUrl: `https://picsum.photos/seed/news-${Math.random()}/600/400`,
      };
    } else if (activeTab === 'stories') {
      data = {
        name: "Community Member " + (stories.length + 1),
        story: "The scholarship and medical support from DIBF changed my trajectory and gave me hope for a better future.",
        location: "Accra, Ghana",
        imageUrl: `https://picsum.photos/seed/story-${Math.random()}/600/400`,
      };
    }

    addDoc(ref, data)
      .then(() => {
        toast({
          title: "Success",
          description: `New ${activeTab} document added successfully.`,
        });
      })
      .catch(async (err) => {
        const permsError = new FirestorePermissionError({
          path: ref.path,
          operation: 'create',
          requestResourceData: data,
        });
        errorEmitter.emit('permission-error', permsError);
      })
      .finally(() => {
        setIsAdding(false);
      });
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time management of your DIBF dynamic content.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild className="gap-2">
            <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
              Firebase Console
            </a>
          </Button>
          <Button onClick={addSampleData} disabled={isAdding || !db} className="gap-2 bg-primary hover:bg-primary/90">
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add Sample {activeTab === 'stories' ? 'Story' : activeTab.slice(0, -1)}
          </Button>
        </div>
      </div>

      {!db && (
        <Card className="border-amber-200 bg-amber-50 mb-8 border-l-4">
          <CardContent className="pt-6 flex items-start gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="font-bold">Firebase connection not established</p>
              <p className="text-sm">
                To see your data, please ensure you have added your Firebase credentials to the 
                <code className="bg-amber-100 px-1.5 py-0.5 rounded mx-1">.env</code> 
                file. You can find these in your Firebase Project Settings under "General".
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="initiatives" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-muted p-1 rounded-xl">
          <TabsTrigger value="initiatives" className="gap-2 px-6">
            <LayoutGrid className="w-4 h-4" />
            Initiatives
          </TabsTrigger>
          <TabsTrigger value="news" className="gap-2 px-6">
            <FileText className="w-4 h-4" />
            News & Updates
          </TabsTrigger>
          <TabsTrigger value="stories" className="gap-2 px-6">
            <Heart className="w-4 h-4" />
            Impact Stories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="initiatives">
          <CollectionTable 
            title="Initiatives" 
            description="Flagship programs and projects"
            data={initiatives} 
            loading={loadingInitiatives}
            columns={['Title', 'Category', 'Status', 'ID']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                <TableCell>
                  {item.active ? (
                    <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" /> Active
                    </span>
                  ) : "Inactive"}
                </TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground">{item.id}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="news">
          <CollectionTable 
            title="News & Insights" 
            description="Foundation blog posts and reports"
            data={news} 
            loading={loadingNews}
            columns={['Date', 'Title', 'Author', 'ID']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="text-xs whitespace-nowrap">{item.date}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="text-muted-foreground">{item.author}</TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground">{item.id}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>

        <TabsContent value="stories">
          <CollectionTable 
            title="Impact Stories" 
            description="Community testimonials and narratives"
            data={stories} 
            loading={loadingStories}
            columns={['Name', 'Location', 'Story Preview', 'ID']}
            renderRow={(item: any) => (
              <TableRow key={item.id}>
                <TableCell className="font-bold">{item.name}</TableCell>
                <TableCell>{item.location}</TableCell>
                <TableCell className="max-w-xs truncate italic text-muted-foreground">"{item.story}"</TableCell>
                <TableCell className="font-mono text-[10px] text-muted-foreground">{item.id}</TableCell>
              </TableRow>
            )}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CollectionTable({ title, description, data, loading, columns, renderRow }: any) {
  return (
    <Card className="shadow-xl border-none">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCcw className="w-10 h-10 animate-spin text-primary opacity-20" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl bg-muted/20">
            <p className="text-muted-foreground">No records found in this collection.</p>
            <p className="text-xs text-muted-foreground/60 mt-2">Add a sample to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col: string) => <TableHead key={col}>{col}</TableHead>)}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map(renderRow)}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
