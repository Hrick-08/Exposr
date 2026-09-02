'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { DocHeading } from '@/lib/types';

export function TableOfContents({ headings }: { headings: DocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -80% 0px', threshold: 0 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-56 shrink-0">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pl-4 pr-6">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          On this page
        </p>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={cn(
                  'block text-sm py-0.5 transition-colors',
                  heading.level === 3 && 'pl-3',
                  activeId === heading.id
                    ? 'text-accent'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
