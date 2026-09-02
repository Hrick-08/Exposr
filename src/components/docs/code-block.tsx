'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ children, language = 'text', filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('group relative my-4 rounded-lg border border-border bg-code-bg overflow-hidden', className)}>
      {/* Header */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border">
          <span className="text-xs text-muted-foreground font-mono">
            {filename || language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy code"
          >
            {copied ? (
              <><Check className="h-3.5 w-3.5 text-green-400" /> Copied</>
            ) : (
              <><Copy className="h-3.5 w-3.5" /> Copy</>
            )}
          </button>
        </div>
      )}
      {/* Code content */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="font-mono text-foreground">{children.trim()}</code>
        </pre>
      </div>
      {/* Copy button if no header */}
      {!filename && !language && (
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 rounded-md bg-surface-raised text-muted-foreground hover:text-foreground transition-all"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
