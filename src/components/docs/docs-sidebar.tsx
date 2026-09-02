'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pr-4 pl-6">
        <nav className="space-y-1">
          {navigation.map((section) => (
            <SidebarSection
              key={section.slug}
              section={section}
              pathname={pathname}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}

function SidebarSection({
  section,
  pathname,
}: {
  section: (typeof navigation)[0];
  pathname: string;
}) {
  const isActive = pathname.includes(`/docs/${section.slug}`);
  const [open, setOpen] = useState(isActive || section.slug === 'getting-started');

  return (
    <div className="mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-1.5 text-sm font-medium text-foreground hover:text-accent transition-colors"
      >
        {section.title}
        <ChevronRight
          className={cn(
            'h-4 w-4 text-muted transition-transform duration-200',
            open && 'rotate-90'
          )}
        />
      </button>
      {open && (
        <ul className="mt-1 space-y-0.5 border-l border-border ml-0 pl-3">
          {section.items.map((item) => {
            const href = `/docs/${section.slug}/${item.slug}`;
            const active = pathname === href;
            return (
              <li key={item.slug}>
                <Link
                  href={href}
                  className={cn(
                    'block py-1 text-sm transition-colors relative',
                    active
                      ? 'text-accent font-medium before:absolute before:-left-3 before:top-0 before:bottom-0 before:w-0.5 before:bg-accent before:rounded-full'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {item.title}
                    {item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-muted text-accent font-medium">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
