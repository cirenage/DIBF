
import { Stethoscope, GraduationCap, Users, BrainCircuit, Building2, BookOpenCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ACTIVITIES = [
  {
    title: "Medical Outreach & Community Health",
    description: "Providing direct healthcare services, screenings, and treatments to underserved populations.",
    icon: Stethoscope,
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Public Health Education & Awareness",
    description: "Empowering communities with vital health knowledge to prevent disease and promote longevity.",
    icon: BookOpenCheck,
    color: "text-teal-600",
    bg: "bg-teal-50"
  },
  {
    title: "Youth & Student Impact Programs",
    description: "Mentoring the next generation of healthcare leaders and social entrepreneurs.",
    icon: GraduationCap,
    color: "text-amber-600",
    bg: "bg-amber-50"
  },
  {
    title: "Mental Health & Youth Wellbeing",
    description: "Addressing psychological health through counseling, advocacy, and peer support networks.",
    icon: BrainCircuit,
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "CSR & Strategic Partnerships",
    description: "Collaborating with corporations to drive meaningful social impact through ethical philanthropy.",
    icon: Building2,
    color: "text-rose-600",
    bg: "bg-rose-50"
  },
  {
    title: "Research & Knowledge Sharing",
    description: "Documenting community stories and health outcomes to inform global policy and practice.",
    icon: Users,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  }
];

export function WhatWeDoGrid() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary">What We Do</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our multi-faceted approach combines immediate relief with long-term sustainable development strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {ACTIVITIES.map((item, idx) => (
            <Card key={idx} className="border-none shadow-md hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-2">
                <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl font-headline font-bold text-secondary group-hover:text-primary transition-colors">
                  {item.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
