import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Connection Problems',
  description: 'Troubleshoot connection issues with Exposr.',
};

export const headings = [
  { id: 'cannot-connect', text: 'Cannot connect to server', level: 2 },
  { id: 'connection-refused', text: 'Connection refused', level: 2 },
  { id: 'server-not-configured', text: 'Server not configured', level: 2 },
  { id: 'token-mismatch', text: 'Token mismatch', level: 2 },
];

export default function ConnectionProblemsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="cannot-connect" className="text-xl font-semibold mt-10 mb-4">Cannot connect to server</h2>
      <p className="text-sm font-medium text-foreground mb-2">Possible causes:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
        <li>The relay server is not running</li>
        <li>The server IP address is incorrect</li>
        <li>A firewall is blocking outbound connections to port 9000</li>
        <li>The server&apos;s firewall is blocking inbound connections on port 9000</li>
      </ul>
      <p className="text-sm font-medium text-foreground mb-2">How to diagnose:</p>
      <CodeBlock language="bash">{`# Test TCP connectivity to the control port
telnet YOUR_SERVER_IP 9000

# Or use nc
nc -zv YOUR_SERVER_IP 9000`}</CodeBlock>
      <p className="text-sm font-medium text-foreground mt-4 mb-2">How to fix:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Verify the server is running with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server start</code></li>
        <li>Check the configured server address in <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code></li>
        <li>Ensure port 9000 is open on the server&apos;s firewall</li>
      </ul>

      <h2 id="connection-refused" className="text-xl font-semibold mt-10 mb-4">Connection refused</h2>
      <p className="text-sm font-medium text-foreground mb-2">Possible causes:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
        <li>The Exposr server process is not running</li>
        <li>The server is running on a different port</li>
      </ul>
      <p className="text-sm font-medium text-foreground mb-2">How to fix:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Start the server with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server start</code></li>
        <li>Check if the server is listening: <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">ss -tlnp | grep 9000</code></li>
      </ul>

      <h2 id="server-not-configured" className="text-xl font-semibold mt-10 mb-4">Server not configured</h2>
      <CodeBlock language="text">{`[ERROR] Server IP is not configured. Run: exposr config set-server <server-ip>`}</CodeBlock>
      <p className="text-sm font-medium text-foreground mt-4 mb-2">How to fix:</p>
      <CodeBlock language="bash">{`exposr config set-server YOUR_SERVER_IP`}</CodeBlock>

      <h2 id="token-mismatch" className="text-xl font-semibold mt-10 mb-4">Token mismatch</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the agent connects but the tunnel fails to register, the agent token may not match the server&apos;s configured token.
      </p>
      <p className="text-sm font-medium text-foreground mb-2">How to fix:</p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        <li>Check the token in <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code> on the client</li>
        <li>Ensure the same token is configured on the server with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server init-token</code></li>
      </ul>
    </div>
  );
}
