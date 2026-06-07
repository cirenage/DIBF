"use client";

import * as React from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';

export function FirebaseErrorListener() {
  const [error, setError] = React.useState<FirestorePermissionError | null>(null);

  React.useEffect(() => {
    return errorEmitter.on('permission-error', (err) => {
      setError(err);
    });
  }, []);

  if (!error) return null;

  return (
    <div className="fixed top-20 right-4 z-[200] max-w-md w-full pointer-events-none">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="pointer-events-auto"
        >
          <Alert variant="destructive" className="shadow-2xl border-2 bg-white dark:bg-slate-950">
            <ShieldAlert className="h-4 w-4" />
            <div className="flex justify-between items-start w-full">
              <div className="flex-1">
                <AlertTitle className="font-bold">Security Rule Denied</AlertTitle>
                <AlertDescription className="mt-2 text-xs space-y-2">
                  <p><strong>Path:</strong> <code className="bg-destructive/10 px-1 rounded">{error.context.path}</code></p>
                  <p><strong>Op:</strong> <code className="bg-destructive/10 px-1 rounded">{error.context.operation}</code></p>
                  {error.context.requestResourceData && (
                    <div className="mt-1">
                      <p className="font-semibold mb-1">Attempted Data:</p>
                      <pre className="text-[10px] bg-muted p-2 rounded overflow-auto max-h-32">
                        {JSON.stringify(error.context.requestResourceData, null, 2)}
                      </pre>
                    </div>
                  )}
                  <p className="text-[10px] opacity-70 italic mt-2">
                    Tip: Update your firestore.rules to allow this operation.
                  </p>
                </AlertDescription>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 ml-2" 
                onClick={() => setError(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
