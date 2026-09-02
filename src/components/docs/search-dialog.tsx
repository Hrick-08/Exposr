'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, ArrowRight } from 'lucide-react';
import { navigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SearchItem {
  title: string;
  section: string;
  slug: string;
}

function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = [];
  for (const section of navigation) {
    for (const item of section.items) {
      items.push({
        title: item.title,
        section: section.title,
        slug: `/docs/${section.slug}/${item.slug}`,
      });
    }
  }
  return items;
}

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchIndex = useRef(buildSearchIndex());

  const results = query.length > 0
    ? searchIndex.current.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.section.toLowerCase().includes(query.toLowerCase())
      )
    : searchIndex.current;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (open) {
          onClose();
        } else {
          // Need parent to open - handled by DocsHeader
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const navigate = useCallback(
    (slug: string) => {
      router.push(slug);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        navigate(results[selectedIndex].slug);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose, results, selectedIndex, navigate]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg">
        <div className="mx-4 rounded-xl border border-border bg-surface shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 border-b border-border">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search documentation..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <kbd className="text-[10px] font-mono text-muted border border-border rounded px-1.5 py-0.5">ESC</kbd>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto py-2">
            {results.length === 0 ? (
              <p className="px-4 py-8 text-sm text-muted-foreground text-center">
                No results found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((item, i) => (
                <button
                  key={item.slug}
                  onClick={() => navigate(item.slug)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors',
                    i === selectedIndex
                      ? 'bg-accent-muted text-accent'
                      : 'text-muted-foreground hover:bg-surface-raised hover:text-foreground'
                  )}
                >
                  <FileText className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.title}</p>
                    <p className="text-xs text-muted truncate">{item.section}</p>
                  </div>
                  <ArrowRight className="h-3 w-3 shrink-0 opacity-50" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
