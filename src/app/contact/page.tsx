
"use client";

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, MessageCircle, Handshake, Users, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ContactSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  inquiryType: z.string().min(1, "Please select an inquiry type"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof ContactSchema>>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      inquiryType: "",
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof ContactSchema>) {
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "We've received your inquiry and will get back to you shortly.",
    });
    form.reset();
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero */}
      <section className="bg-secondary text-white py-24 text-center">
        <div className="container mx-auto px-4 max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-5xl font-headline font-bold">Connect With Us</h1>
          <p className="text-xl text-white/70 leading-relaxed">
            Whether you are looking to partner, volunteer, or simply learn more about our work, 
            our team is here to help.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-lg border-none">
              <CardContent className="p-8 space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Email Support</h4>
                    <p className="text-sm text-muted-foreground">info@dibfglobal.org</p>
                    <p className="text-sm text-muted-foreground">partners@dibfglobal.org</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Phone</h4>
                    <p className="text-sm text-muted-foreground">+1 (555) 000-0000</p>
                    <p className="text-xs text-muted-foreground italic">Mon-Fri, 9am - 5pm GMT</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary">Global HQ</h4>
                    <p className="text-sm text-muted-foreground">Strategic Hub, Accra, Ghana</p>
                    <p className="text-sm text-muted-foreground">Support Center, Nairobi, Kenya</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-none bg-primary text-white">
              <CardHeader>
                <CardTitle className="font-headline font-bold">Specific Inquiries</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="flex items-center gap-3 text-sm">
                    <Handshake className="w-4 h-4" />
                    <span>Corporate & University Partnerships</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Users className="w-4 h-4" />
                    <span>Volunteer & Field Programs</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <MessageCircle className="w-4 h-4" />
                    <span>Media & Press Relations</span>
                 </div>
                 <div className="flex items-center gap-3 text-sm">
                    <Info className="w-4 h-4" />
                    <span>General Foundation Inquiries</span>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="lg:col-span-2 shadow-xl border-none">
            <CardHeader className="p-8 pb-0">
              <CardTitle className="text-2xl font-headline font-bold text-secondary">Send a Message</CardTitle>
              <CardDescription>Fill out the form below and a member of our team will respond within 48 hours.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="organization"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Organization (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Your Company/Institution" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="inquiryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inquiry Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select what you're interested in" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="volunteer">Volunteer Application</SelectItem>
                            <SelectItem value="donation">Donation/Give Support</SelectItem>
                            <SelectItem value="media">Media/Press Inquiry</SelectItem>
                            <SelectItem value="general">General Information</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us how we can help you..." 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full h-14 font-bold text-lg gap-2">
                    <Send className="w-5 h-5" />
                    Submit Inquiry
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
