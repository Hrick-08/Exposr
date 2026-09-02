import { File, Folder } from 'lucide-react';

interface FileTreeItem {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeItem[];
}

export function FileTree({ items }: { items: FileTreeItem[] }) {
  return (
    <div className="my-4 rounded-lg border border-border bg-code-bg p-4 font-mono text-sm">
      <FileTreeNode items={items} depth={0} />
    </div>
  );
}

function FileTreeNode({ items, depth }: { items: FileTreeItem[]; depth: number }) {
  return (
    <ul className={depth > 0 ? 'ml-4 border-l border-border pl-3' : ''}>
      {items.map((item, i) => (
        <li key={i} className="py-0.5">
          <div className="flex items-center gap-2">
            {item.type === 'directory' ? (
              <Folder className="h-4 w-4 text-accent shrink-0" />
            ) : (
              <File className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
            <span className={item.type === 'directory' ? 'text-foreground' : 'text-muted-foreground'}>
              {item.name}
            </span>
          </div>
          {item.children && <FileTreeNode items={item.children} depth={depth + 1} />}
        </li>
      ))}
    </ul>
  );
}
