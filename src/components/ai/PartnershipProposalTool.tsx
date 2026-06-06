
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FileText, Sparkles, Loader2, Download, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { generatePartnershipProposal } from '@/ai/flows/generate-partnership-proposal';
import { useToast } from '@/hooks/use-toast';

const FormSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required"),
  organizationFocus: z.string().min(10, "Please describe your focus in more detail"),
  partnershipInterests: z.string().min(10, "Please specify what you'd like to achieve together"),
});

export function PartnershipProposalTool() {
  const [proposal, setProposal] = React.useState<string | null>(null);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      organizationName: "",
      organizationFocus: "",
      partnershipInterests: "",
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsGenerating(true);
    setProposal(null);
    try {
      const result = await generatePartnershipProposal(data);
      setProposal(result.proposalContent);
      toast({
        title: "Proposal Generated!",
        description: "Your draft partnership proposal is ready below.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate proposal. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const copyToClipboard = () => {
    if (!proposal) return;
    navigator.clipboard.writeText(proposal);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Section */}
        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Proposal Assistant</CardTitle>
            <CardDescription>
              Tell us about your organization to generate a customized draft partnership proposal with DIBF.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Global Health Institute" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organizationFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Focus</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What does your organization specialize in?" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="partnershipInterests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Partnership Goals</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="What specific areas of DIBF's work interest you?" 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        e.g., Clinical research, student exchange, CSR initiatives.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full py-6 font-bold text-lg gap-2" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Crafting Proposal...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5" />
                      Generate Draft Proposal
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Results Section */}
        <div className="space-y-6">
          {proposal ? (
            <Card className="shadow-2xl border-accent/20 h-full animate-in zoom-in-95 duration-300">
              <CardHeader className="bg-accent/5 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-headline font-bold text-secondary">Draft Proposal</CardTitle>
                  <CardDescription>Review and customize your pitch</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={copyToClipboard} className="h-9 w-9">
                    {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="whitespace-pre-wrap text-sm text-secondary/80 leading-relaxed max-h-[500px] overflow-y-auto pr-2 custom-scrollbar italic font-body">
                  {proposal}
                </div>
              </CardContent>
              <CardFooter className="bg-muted/30 p-4 border-t">
                <p className="text-xs text-muted-foreground">
                  This is an AI-generated draft to help you start the conversation. 
                  Our team will review your final submission with you.
                </p>
              </CardFooter>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-muted-foreground/20 rounded-2xl bg-muted/10 text-center space-y-4">
              <div className="w-16 h-16 bg-muted flex items-center justify-center rounded-full text-muted-foreground/40">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary/40">No Proposal Generated Yet</h3>
                <p className="text-sm text-muted-foreground/60">Fill out the form to create a compelling pitch.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
