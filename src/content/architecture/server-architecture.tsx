import { FileTree } from '@/components/docs/file-tree';

export const meta = {
  title: 'Server Architecture',
  description: 'Internal structure of the Exposr relay server.',
};

export const headings = [
  { id: 'structure', text: 'File structure', level: 2 },
  { id: 'modules', text: 'Modules', level: 2 },
];

export default function ServerArchitecturePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="structure" className="text-xl font-semibold mt-10 mb-4">File structure</h2>
      <FileTree items={[
        {
          name: 'server',
          type: 'directory',
          children: [
            { name: '__init__.py', type: 'file' },
            { name: 'control.py', type: 'file' },
            { name: 'data.py', type: 'file' },
            { name: 'tunnel.py', type: 'file' },
            { name: 'ports.py', type: 'file' },
            { name: 'main.py', type: 'file' },
          ],
        },
      ]} />

      <h2 id="modules" className="text-xl font-semibold mt-10 mb-4">Modules</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">main.py</code></h3>
          <p className="text-sm text-muted-foreground">Server entry point. Starts the control and data listeners.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">control.py</code></h3>
          <p className="text-sm text-muted-foreground">Control channel handler. Accepts agent connections on port 9000, validates tokens, processes REGISTER requests, and sends CONNECT notifications.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">data.py</code></h3>
          <p className="text-sm text-muted-foreground">Data channel handler. Accepts data connections on port 9001, matches UUIDs, and bridges data connections with public client sockets.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">tunnel.py</code></h3>
          <p className="text-sm text-muted-foreground">Tunnel management. Tracks active tunnels, maps public ports to agents, and handles cleanup on disconnection.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">ports.py</code></h3>
          <p className="text-sm text-muted-foreground">Port management. Tracks port ownership, handles registration, and releases ports when agents disconnect.</p>
        </div>
      </div>
    </div>
  );
}
