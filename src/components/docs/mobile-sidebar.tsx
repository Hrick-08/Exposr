'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <div className="fixed inset-0 bg-black/60" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-background border-r border-border overflow-y-auto">
        <div className="p-4 pt-20">
          <nav className="space-y-1">
            {navigation.map((section) => (
              <div key={section.slug} className="mb-4">
                <p className="text-sm font-medium text-foreground mb-1">{section.title}</p>
                <ul className="space-y-0.5 border-l border-border pl-3">
                  {section.items.map((item) => {
                    const href = `/docs/${section.slug}/${item.slug}`;
                    const active = pathname === href;
                    return (
                      <li key={item.slug}>
                        <Link
                          href={href}
                          className={cn(
                            'block py-1 text-sm transition-colors',
                            active
                              ? 'text-accent font-medium'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
