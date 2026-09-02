import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Data Connections',
  description: 'Dedicated data tunnels for forwarding traffic.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'per-connection-model', text: 'Per-connection model', level: 2 },
  { id: 'connection-flow', text: 'Connection flow', level: 2 },
];

export default function DataConnectionsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Data connections carry the actual traffic between public users and local services. Each incoming public connection gets its own dedicated data tunnel through port <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9001</code> on the relay server.
      </p>

      <h2 id="per-connection-model" className="text-xl font-semibold mt-10 mb-4">Per-connection model</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr uses a per-connection data tunnel model. This means:
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
        <li>Each public connection gets a unique UUID</li>
        <li>A fresh TCP connection to port 9001 is created for each public connection</li>
        <li>The data connection is identified by the UUID</li>
        <li>When the public client disconnects, the corresponding data connection is closed</li>
      </ul>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        This model is simple and reliable but introduces overhead because a new TCP handshake is required for every public connection. Connection pooling is a planned improvement.
      </p>

      <h2 id="connection-flow" className="text-xl font-semibold mt-10 mb-4">Connection flow</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
        <li>Server receives a public connection and generates a UUID</li>
        <li>Server sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">CONNECT &lt;uuid&gt;</code> to the agent over the control channel</li>
        <li>Agent connects to the local service on the target port</li>
        <li>Agent opens a new TCP connection to port 9001</li>
        <li>Agent sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">DATA &lt;uuid&gt;</code> to identify the connection</li>
        <li>Server matches the UUID and bridges the public socket with the data connection</li>
        <li>Traffic flows bidirectionally using asyncio streams</li>
      </ol>
      <CodeBlock language="text">{`# Agent -> Server (on port 9001):
DATA 8bab2f9a-b0e2-4db2-8fed-9a8dda8e3aed`}</CodeBlock>
    </div>
  );
}
