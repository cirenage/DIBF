
import { Target, Eye, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function MissionVision() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full -ml-48 -mb-48 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">A Purpose-Driven Foundation</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          <p className="text-lg text-muted-foreground font-body">
            DIBF advances health equity, strengthens community wellbeing, and supports sustainable development 
            across Africa and underserved communities globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission */}
          <Card className="border-none shadow-2xl shadow-secondary/5 group overflow-hidden">
            <CardContent className="p-10 space-y-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-secondary">Our Mission</h3>
              <p className="text-lg text-secondary/80 leading-relaxed italic">
                “To create sustainable pathways for people, institutions, and communities to improve lives, 
                improve healthcare, and advance human dignity through service, partnership, innovation, 
                and purposeful giving.”
              </p>
            </CardContent>
            <div className="h-2 w-full bg-primary" />
          </Card>

          {/* Vision */}
          <Card className="border-none shadow-2xl shadow-secondary/5 group overflow-hidden">
            <CardContent className="p-10 space-y-6">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-headline font-bold text-secondary">Our Vision</h3>
              <p className="text-lg text-secondary/80 leading-relaxed italic">
                “A world where every person, institution, and community has a meaningful pathway to create 
                lasting impact, and where Africa's challenges inspire global collaboration, innovation, 
                and shared responsibility.”
              </p>
            </CardContent>
            <div className="h-2 w-full bg-accent" />
          </Card>
        </div>
      </div>
    </section>
  );
}
