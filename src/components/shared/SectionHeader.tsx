
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  alignment?: 'center' | 'left';
  className?: string;
  accent?: boolean;
}

export function SectionHeader({ title, subtitle, alignment = 'center', className, accent = true }: SectionHeaderProps) {
  return (
    <div className={cn(
      "mb-16 space-y-4",
      alignment === 'center' ? "text-center" : "text-left",
      className
    )}>
      <h2 className="text-3xl md:text-4xl font-headline font-bold text-secondary tracking-tight">
        {title}
      </h2>
      {accent && <div className={cn("w-20 h-1.5 bg-primary rounded-full", alignment === 'center' ? "mx-auto" : "ml-0")} />}
      {subtitle && <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{subtitle}</p>}
    </div>
  );
}
