import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function Pagination({
  prev,
  next,
}: {
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
}) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
      {prev ? (
        <Link
          href={`/docs/${prev.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>{prev.title}</span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/docs/${next.slug}`}
          className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
        >
          <span>{next.title}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : (
        <div />
      )}
    </div>
  );
}
