import { FileTree } from '@/components/docs/file-tree';

export const meta = {
  title: 'Client Architecture',
  description: 'Internal structure of the Exposr client.',
};

export const headings = [
  { id: 'structure', text: 'File structure', level: 2 },
  { id: 'modules', text: 'Modules', level: 2 },
];

export default function ClientArchitecturePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="structure" className="text-xl font-semibold mt-10 mb-4">File structure</h2>
      <FileTree items={[
        {
          name: 'client',
          type: 'directory',
          children: [
            { name: '__init__.py', type: 'file' },
            { name: 'cli.py', type: 'file' },
            { name: 'config.py', type: 'file' },
            { name: 'connection.py', type: 'file' },
            { name: 'tunnel.py', type: 'file' },
            { name: 'main.py', type: 'file' },
          ],
        },
      ]} />

      <h2 id="modules" className="text-xl font-semibold mt-10 mb-4">Modules</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">main.py</code></h3>
          <p className="text-sm text-muted-foreground">Entry point. Registered as the <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">exposr</code> console command via the <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">client.main:main</code> entry point in setup.py.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">cli.py</code></h3>
          <p className="text-sm text-muted-foreground">Command-line argument parsing. Handles <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">expose</code>, <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">config</code>, and <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">server</code> subcommands.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">config.py</code></h3>
          <p className="text-sm text-muted-foreground">Configuration management. Reads/writes <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code> and manages the agent token.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">connection.py</code></h3>
          <p className="text-sm text-muted-foreground">Manages the persistent control connection to the server. Handles authentication, port registration, and CONNECT message handling.</p>
        </div>
        <div>
          <h3 className="text-base font-medium text-foreground mb-1"><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">tunnel.py</code></h3>
          <p className="text-sm text-muted-foreground">Handles individual data tunnels. Creates connections to both the local service and the server&apos;s data port, forwarding traffic bidirectionally.</p>
        </div>
      </div>
    </div>
  );
}
