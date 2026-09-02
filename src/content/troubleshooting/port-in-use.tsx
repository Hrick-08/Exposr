import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Port Already in Use',
  description: 'Troubleshoot port conflicts with Exposr.',
};

export const headings = [
  { id: 'public-port', text: 'Public port unavailable', level: 2 },
  { id: 'local-port', text: 'Local port not listening', level: 2 },
  { id: 'server-ports', text: 'Server ports in use', level: 2 },
];

export default function PortInUsePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="public-port" className="text-xl font-semibold mt-10 mb-4">Public port unavailable</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the default port 25565 is taken by another agent, Exposr automatically falls back to a random port in the 20000–30000 range. If you specified a custom port and it&apos;s unavailable, Exposr will not fall back.
      </p>
      <p className="text-sm font-medium text-foreground mb-2">How to fix:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Let Exposr use automatic port assignment (omit the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">to</code> parameter)</li>
        <li>Choose a different public port: <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr expose 3000 to 28000</code></li>
      </ul>

      <h2 id="local-port" className="text-xl font-semibold mt-10 mb-4">Local port not listening</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the local service isn&apos;t running on the specified port, Exposr will connect to the server but forwarded traffic will fail.
      </p>
      <p className="text-sm font-medium text-foreground mb-2">How to diagnose:</p>
      <CodeBlock language="bash">{`# Check if the local port is listening
netstat -an | findstr :3000    # Windows
ss -tlnp | grep :3000          # Linux`}</CodeBlock>

      <h2 id="server-ports" className="text-xl font-semibold mt-10 mb-4">Server ports in use</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the server&apos;s control (9000) or data (9001) ports are already in use by another process, the server will fail to start.
      </p>
      <p className="text-sm font-medium text-foreground mb-2">How to diagnose:</p>
      <CodeBlock language="bash">{`ss -tlnp | grep -E '9000|9001'`}</CodeBlock>
    </div>
  );
}
