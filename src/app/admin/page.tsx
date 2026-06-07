
"use client";

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, Plus, Loader2, RefreshCcw, AlertCircle } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = React.useState(false);

  const initiativesRef = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'initiatives');
  }, [db]);

  const { data: initiatives, loading, error } = useCollection(initiativesRef);

  const addTestData = async () => {
    if (!initiativesRef) return;
    setIsAdding(true);

    const newInitiative = {
      title: "New Community Outreach " + (initiatives.length + 1),
      description: "A dynamically added initiative to demonstrate Firestore connectivity.",
      category: "Healthcare",
      imageUrl: "https://picsum.photos/seed/" + Math.random() + "/600/400",
      active: true,
      createdAt: serverTimestamp(),
    };

    addDoc(initiativesRef, newInitiative)
      .then(() => {
        toast({
          title: "Success",
          description: "Initiative added to Firestore!",
        });
      })
      .catch(async (err) => {
        const permsError = new FirestorePermissionError({
          path: initiativesRef.path,
          operation: 'create',
          requestResourceData: newInitiative,
        });
        errorEmitter.emit('permission-error', permsError);
      })
      .finally(() => setIsAdding(false));
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your dynamic content stored in Firebase Firestore.
          </p>
        </div>
        <Button onClick={addTestData} disabled={isAdding || !db} className="gap-2">
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add Sample Initiative
        </Button>
      </div>

      {!db && (
        <Card className="border-amber-200 bg-amber-50 mb-8">
          <CardContent className="pt-6 flex items-center gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              Firebase credentials are not configured. Check your <strong>.env</strong> file and ensure 
              <strong>NEXT_PUBLIC_FIREBASE_API_KEY</strong> is set.
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-xl border-none">
        <CardHeader>
          <CardTitle>Initiatives Collection</CardTitle>
          <CardDescription>
            Documents found in the <code className="bg-muted px-1 rounded">/initiatives</code> path.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <RefreshCcw className="w-8 h-8 animate-spin text-primary opacity-20" />
            </div>
          ) : initiatives.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-xl">
              <p className="text-muted-foreground">No documents found in this collection.</p>
              <Button variant="link" onClick={addTestData} className="mt-2">Create your first entry</Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {initiatives.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.active ? (
                          <span className="text-xs text-green-600 font-bold flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-[10px] text-muted-foreground">
                        {item.id}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
