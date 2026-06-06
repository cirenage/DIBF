
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-medical');
  const fallbackUrl = "https://picsum.photos/seed/dibf-hero/1200/800";

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={heroImage?.imageUrl || fallbackUrl}
          alt="DIBF Impact"
          fill
          className="object-cover"
          priority
          data-ai-hint="medical outreach"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/95 via-secondary/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-block px-4 py-1.5 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full">
            <span className="text-primary-foreground font-semibold text-sm tracking-wide uppercase">
              Healing Communities. Empowering Futures.
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-headline font-extrabold text-white leading-[1.1]">
            Advancing <span className="text-primary italic">Health</span>, Human Dignity, and Sustainable Development.
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 font-body leading-relaxed max-w-2xl">
            DIBF is the nonprofit and social impact arm of Doctors in Business Global, 
            dedicated to health equity, youth empowerment, and sustainable humanitarian interventions 
            across Africa and the global community.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
              <Link href="/give">Donate Now</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg font-bold bg-white/5 border-white/20 text-white hover:bg-white hover:text-secondary">
              <Link href="/partnerships">Partner With Us</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="h-14 px-8 text-lg font-bold text-white hover:bg-white/10">
              <Link href="/what-we-do">Explore Our Work</Link>
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">15K+</p>
              <p className="text-sm text-white/60">Lives Impacted</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">45+</p>
              <p className="text-sm text-white/60">Community Clinics</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">12+</p>
              <p className="text-sm text-white/60">Regional Projects</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
