"use client";

import * as React from 'react';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  getDocs, 
  limit, 
  Firestore 
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Plus, 
  Loader2, 
  Sparkles, 
  LayoutGrid,
  Users,
  Handshake,
  DollarSign,
  Calendar,
  BookOpen,
  Heart,
  FileText,
  Mail,
  UserPlus,
  Briefcase
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminDashboard() {
  const db = useFirestore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState('initiatives');
  const [isSeeding, setIsSeeding] = React.useState(false);

  // Memoized Base Collection References
  const initiativesRef = useMemoFirebase(() => db ? collection(db, 'initiatives') : null, [db]);
  const newsRef = useMemoFirebase(() => db ? collection(db, 'news') : null, [db]);
  const storiesRef = useMemoFirebase(() => db ? collection(db, 'impactStories') : null, [db]);
  const partnersRef = useMemoFirebase(() => db ? collection(db, 'partners') : null, [db]);
  const eventsRef = useMemoFirebase(() => db ? collection(db, 'events') : null, [db]);
  const teamRef = useMemoFirebase(() => db ? collection(db, 'teamMembers') : null, [db]);
  const publicationsRef = useMemoFirebase(() => db ? collection(db, 'publications') : null, [db]);
  const donationsRef = useMemoFirebase(() => db ? collection(db, 'donations') : null, [db]);
  const contactsRef = useMemoFirebase(() => db ? collection(db, 'contactMessages') : null, [db]);
  const volunteersRef = useMemoFirebase(() => db ? collection(db, 'volunteerRequests') : null, [db]);
  const partnershipsRef = useMemoFirebase(() => db ? collection(db, 'partnershipRequests') : null, [db]);

  // Data Subscriptions
  const { data: initiatives, loading: loadingInitiatives } = useCollection(initiativesRef);
  const { data: news, loading: loadingNews } = useCollection(newsRef);
  const { data: stories, loading: loadingStories } = useCollection(storiesRef);
  const { data: partners, loading: loadingPartners } = useCollection(partnersRef);
  const { data: events, loading: loadingEvents } = useCollection(eventsRef);
  const { data: team, loading: loadingTeam } = useCollection(teamRef);
  const { data: publications, loading: loadingPublications } = useCollection(publicationsRef);
  const { data: donations } = useCollection(donationsRef);
  const { data: contacts } = useCollection(contactsRef);
  const { data: volunteers } = useCollection(volunteersRef);
  const { data: partnershipReqs } = useCollection(partnershipsRef);

  const getSeedData = (colName: string): any[] => {
    switch(colName) {
      case 'initiatives':
        return [
          { title: "The Tinewonsa Project", slug: "tinewonsa", summary: "Revolutionizing primary healthcare in rural Africa.", description: "The Tinewonsa Project establishes clinical hubs that provide essential care to remote villages.", category: "Medical Outreach", location: "Ghana", imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef", status: "active", featured: true },
          { title: "Dollar-A-Day Campaign", slug: "dollar-a-day", summary: "Sustainable micro-philanthropy.", description: "Empowering individuals to support continuous medicine supply through small daily donations.", category: "Sustainable Giving", location: "Global", imageUrl: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6", status: "active", featured: true },
          { title: "African Field School", slug: "field-school", summary: "Practical medical education.", description: "Training the next generation of healthcare leaders in tropical medicine and leadership.", category: "Education Support", location: "Kenya", imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7", status: "active", featured: true },
          { title: "Maternal Health Shield", slug: "maternal-health", summary: "Protecting mothers and newborns.", description: "Providing prenatal care and safe birthing kits to underserved rural communities.", category: "Women’s Health", location: "Nigeria", imageUrl: "https://images.unsplash.com/photo-1516627145497-ae6968895b74", status: "active", featured: false },
          { title: "Youth Leadership Hub", slug: "youth-leadership", summary: "Empowering young Africans.", description: "Developing leadership skills and business acumen among local youth to drive social change.", category: "Youth Development", location: "Rwanda", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f", status: "active", featured: false },
          { title: "Water for Wellness", slug: "water-wellness", summary: "Clean water for clinical hubs.", description: "Implementing sustainable clean water systems for community-led clinics.", category: "Community Support", location: "Uganda", imageUrl: "https://images.unsplash.com/photo-1541544741938-0af808871cc0", status: "active", featured: false },
          { title: "Mental Health Awareness", slug: "mental-health", summary: "Breaking the stigma.", description: "Community-based counseling and advocacy for mental wellbeing in post-conflict zones.", category: "Public Health Advocacy", location: "Ethiopia", imageUrl: "https://images.unsplash.com/photo-1493839523149-2864fca44919", status: "active", featured: false },
          { title: "Tech in Medicine", slug: "tech-medicine", summary: "Telemedicine for remote areas.", description: "Integrating digital tools to connect rural patients with urban specialists.", category: "Professional Development", location: "South Africa", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", status: "active", featured: false }
        ];
      case 'news':
        return Array.from({ length: 8 }).map((_, i) => ({
          title: `DIBF Update: Global Impact Reach ${i + 1}`,
          slug: `update-${i + 1}`,
          excerpt: "Our recent mission has expanded healthcare access to over 5,000 new beneficiaries.",
          content: "Full detailed story about the foundation's progress and upcoming goals in the region.",
          category: i % 2 === 0 ? "Mission News" : "Insights",
          author: "DIBF Comms Team",
          imageUrl: `https://images.unsplash.com/photo-${1581056771107 + i}`,
          publishedAt: new Date().toISOString(),
          featured: i < 3
        }));
      case 'impactStories':
        return Array.from({ length: 6 }).map((_, i) => ({
          title: "A New Beginning",
          slug: `story-${i + 1}`,
          beneficiary: `Beneficiary ${i + 1}`,
          location: "Accra, Ghana",
          summary: "How the clinical hub changed my family's future.",
          story: "A long-form narrative about transformation and dignity through healthcare.",
          imageUrl: `https://images.unsplash.com/photo-${1488521787991 + i}`,
          impactMetric: "Improved Health Status",
          featured: i < 3
        }));
      case 'partners':
        return [
          { name: "University of Medical Sciences", type: "University", description: "Academic research partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: true },
          { name: "Global Health Corp", type: "Corporate", description: "Sponsoring medical supplies.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: true },
          { name: "Hope Foundation", type: "Foundation", description: "Grant-making partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false },
          { name: "Village Aid NGO", type: "NGO", description: "Field logistics partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false },
          { name: "Tech Health Labs", type: "Corporate", description: "Digital tools provider.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false },
          { name: "African Med Schools Assoc", type: "University", description: "Student exchange partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false },
          { name: "Unity Health Fund", type: "Foundation", description: "Sustainability partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false },
          { name: "Global Outreach Partners", type: "NGO", description: "Global advocacy partner.", website: "#", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501c27", featured: false }
        ];
      case 'events':
        return [
          { title: "DIBF London Gala 2024", slug: "gala-2024", description: "A night of fundraising and impact.", location: "London, UK", eventDate: "2024-11-20", imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622", status: "upcoming", featured: true },
          { title: "Nairobi Field Mission", slug: "mission-2024", description: "Medical outreach and training.", location: "Nairobi, Kenya", eventDate: "2024-10-15", imageUrl: "https://images.unsplash.com/photo-1488521787991-ad7b828f7051", status: "upcoming", featured: true },
          { title: "Health Equity Seminar", slug: "seminar-2024", description: "Online policy discussion.", location: "Virtual", eventDate: "2024-09-05", imageUrl: "https://images.unsplash.com/photo-1540575861501-7ad05823c9f5", status: "upcoming", featured: false },
          { title: "Legacy Outreach 2023", slug: "outreach-2023", description: "Annual community health fair.", location: "Accra, Ghana", eventDate: "2023-12-10", imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d", status: "past", featured: false },
          { title: "Youth Summit Africa", slug: "summit-2023", description: "Leadership hub launch.", location: "Kigali, Rwanda", eventDate: "2023-08-20", imageUrl: "https://images.unsplash.com/photo-1523580494863-6f3031224c94", status: "past", featured: false },
          { title: "Volunteer Training Week", slug: "training-2023", description: "Empowering our ground team.", location: "Lagos, Nigeria", eventDate: "2023-05-12", imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4", status: "past", featured: false }
        ];
      case 'teamMembers':
        return [
          { name: "Dr. Kofi Mensah", role: "Executive Director", bio: "Medical pioneer in tropical health.", order: 1, featured: true, imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d" },
          { name: "Sarah Owusu", role: "Head of Operations", bio: "Expert in humanitarian logistics.", order: 2, featured: true, imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2" },
          { name: "James Adeyemi", role: "Field Coordinator", bio: "Community development specialist.", order: 3, featured: false, imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" },
          { name: "Dr. Amara Eze", role: "Medical Director", bio: "Public health research lead.", order: 4, featured: true, imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f" },
          { name: "David Kimani", role: "Partnership Manager", bio: "Strategic advisor for global NGOs.", order: 5, featured: false, imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d" },
          { name: "Linda Mbeki", role: "Communications Lead", bio: "Advocate for health storytelling.", order: 6, featured: false, imageUrl: "https://images.unsplash.com/photo-1567532939604-b6c5b0ad2e01" }
        ];
      case 'publications':
        return Array.from({ length: 6 }).map((_, i) => ({
          title: `Health Equity Report 202${3-i}`,
          slug: `report-${2023-i}`,
          summary: "An in-depth analysis of community-led healthcare delivery.",
          category: i % 2 === 0 ? "Annual Report" : "Research Paper",
          fileUrl: "#",
          coverImageUrl: "https://images.unsplash.com/photo-1586281380349-632531db7ed4",
          publishedAt: `202${3-i}-01-01`,
          featured: i === 0
        }));
      case 'donations':
        return Array.from({ length: 10 }).map((_, i) => ({
          donorName: `Donor ${i + 1}`,
          donorEmail: `donor${i + 1}@example.com`,
          amount: Math.floor(Math.random() * 500) + 10,
          currency: "USD",
          purpose: "Tinewonsa Project",
          status: "completed"
        }));
      case 'contactMessages':
        return Array.from({ length: 6 }).map((_, i) => ({
          name: `Visitor ${i + 1}`,
          email: `visitor${i + 1}@example.com`,
          subject: "Inquiry about missions",
          message: "I would like to know more about the upcoming medical outreach.",
          status: "new"
        }));
      case 'volunteerRequests':
        return Array.from({ length: 6 }).map((_, i) => ({
          fullName: `Volunteer ${i + 1}`,
          email: `volunteer${i + 1}@example.com`,
          phone: "+1 555-0000",
          areaOfInterest: "Medical Support",
          message: "I am a registered nurse looking to help.",
          status: "pending"
        }));
      case 'partnershipRequests':
        return Array.from({ length: 6 }).map((_, i) => ({
          organizationName: `Org ${i + 1}`,
          contactPerson: `Manager ${i + 1}`,
          email: `org${i + 1}@example.com`,
          phone: "+1 555-1111",
          partnershipType: "Corporate",
          message: "We want to support your next mission.",
          status: "pending"
        }));
      default:
        return [];
    }
  };

  const seedDatabase = async () => {
    if (!db) return;
    setIsSeeding(true);
    
    const collectionsToSeed = [
      'initiatives', 'news', 'impactStories', 'partners', 'events', 
      'teamMembers', 'publications', 'donations', 'contactMessages', 
      'volunteerRequests', 'partnershipRequests'
    ];
    
    const results = { seeded: [] as string[], skipped: [] as string[], failed: [] as string[] };

    try {
      for (const colName of collectionsToSeed) {
        const colRef = collection(db, colName);
        const snapshot = await getDocs(query(colRef, limit(1)));
        
        if (!snapshot.empty) {
          results.skipped.push(colName);
          continue;
        }

        const samples = getSeedData(colName);
        for (const item of samples) {
          await addDoc(colRef, { ...item, createdAt: serverTimestamp() });
        }
        results.seeded.push(`${colName} (${samples.length})`);
      }

      toast({ 
        title: "Database Seeded", 
        description: `Seeded: ${results.seeded.length}. Skipped: ${results.skipped.length}.` 
      });
    } catch (err: any) {
      console.error(err);
      toast({ 
        variant: "destructive",
        title: "Seeding Failed", 
        description: err.code === 'permission-denied' ? "Firestore permission denied. Check rules." : "An error occurred." 
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-headline font-bold text-secondary flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Foundation Data Hub
          </h1>
          <p className="text-muted-foreground mt-2">Manage all DIBF website content and collections from a central dashboard.</p>
        </div>
        <Button 
          onClick={seedDatabase} 
          disabled={isSeeding || !db}
          className="gap-2 h-12 px-8 font-bold shadow-lg shadow-primary/20"
        >
          {isSeeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Seed Website Data
        </Button>
      </div>

      <Tabs defaultValue="initiatives" onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex flex-wrap h-auto gap-2 p-1.5 bg-muted rounded-xl justify-start overflow-x-auto max-w-full">
          <TabsTrigger value="initiatives" className="gap-2 whitespace-nowrap"><LayoutGrid className="w-4 h-4" /> Initiatives</TabsTrigger>
          <TabsTrigger value="news" className="gap-2 whitespace-nowrap"><FileText className="w-4 h-4" /> News</TabsTrigger>
          <TabsTrigger value="events" className="gap-2 whitespace-nowrap"><Calendar className="w-4 h-4" /> Events</TabsTrigger>
          <TabsTrigger value="impactStories" className="gap-2 whitespace-nowrap"><Heart className="w-4 h-4" /> Impact Stories</TabsTrigger>
          <TabsTrigger value="partners" className="gap-2 whitespace-nowrap"><Handshake className="w-4 h-4" /> Partners</TabsTrigger>
          <TabsTrigger value="teamMembers" className="gap-2 whitespace-nowrap"><Users className="w-4 h-4" /> Team</TabsTrigger>
          <TabsTrigger value="publications" className="gap-2 whitespace-nowrap"><BookOpen className="w-4 h-4" /> Pubs</TabsTrigger>
          <TabsTrigger value="donations" className="gap-2 whitespace-nowrap"><DollarSign className="w-4 h-4" /> Donations</TabsTrigger>
          <TabsTrigger value="contactMessages" className="gap-2 whitespace-nowrap"><Mail className="w-4 h-4" /> Contacts</TabsTrigger>
          <TabsTrigger value="volunteerRequests" className="gap-2 whitespace-nowrap"><UserPlus className="w-4 h-4" /> Volunteers</TabsTrigger>
          <TabsTrigger value="partnershipRequests" className="gap-2 whitespace-nowrap"><Briefcase className="w-4 h-4" /> Partner Req</TabsTrigger>
        </TabsList>

        <Card className="shadow-xl border-none">
          <CardContent className="pt-6">
            <TabsContent value="initiatives">
               <CollectionTable data={initiatives} loading={loadingInitiatives} 
                columns={['Title', 'Category', 'Status']}
                renderRow={(item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-bold">{item.title}</TableCell>
                    <TableCell><Badge variant="secondary">{item.category}</Badge></TableCell>
                    <TableCell><Badge>{item.status}</Badge></TableCell>
                  </TableRow>
                )} />
            </TabsContent>
            {/* ... other tab contents simplified for context ... */}
            <TabsContent value="news">
               <CollectionTable data={news} loading={loadingNews} 
                columns={['Title', 'Author', 'Featured']}
                renderRow={(item: any) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>{item.author}</TableCell>
                    <TableCell>{item.featured ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                )} />
            </TabsContent>
            {/* Remaining tab contents follow similar pattern */}
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}

function CollectionTable({ data, loading, columns, renderRow }: any) {
  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!data || data.length === 0) return <div className="text-center py-12 text-muted-foreground italic">No data. Click "Seed Website Data" to populate.</div>;

  return (
    <Table>
      <TableHeader><TableRow className="bg-muted/50">{columns.map((col: string) => <TableHead key={col}>{col}</TableHead>)}</TableRow></TableHeader>
      <TableBody>{data.map(renderRow)}</TableBody>
    </Table>
  );
}