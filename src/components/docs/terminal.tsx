'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function Terminal({ children, title }: { children: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-lg border border-border bg-[#0c0c0f] overflow-hidden">
      {/* Terminal header with dots */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          {title && <span className="ml-2 text-xs text-muted-foreground font-mono">{title}</span>}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Copy"
        >
          {copied ? (
            <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</>
          ) : (
            <><Copy className="h-3.5 w-3.5" /> Copy</>
          )}
        </button>
      </div>
      {/* Terminal content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed font-mono text-green-400">
          {children.trim()}
        </pre>
      </div>
    </div>
  );
}
