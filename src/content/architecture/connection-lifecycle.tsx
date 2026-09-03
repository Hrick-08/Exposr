import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Connection Lifecycle',
  description: 'The complete lifecycle of a tunneled connection.',
};

export const headings = [
  { id: 'setup', text: 'Tunnel setup', level: 2 },
  { id: 'incoming', text: 'Incoming connection', level: 2 },
  { id: 'teardown', text: 'Teardown', level: 2 },
];

export default function ConnectionLifecyclePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="setup" className="text-xl font-semibold mt-10 mb-4">Tunnel setup</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
        <li>Agent connects to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">SERVER_IP:9000</code></li>
        <li>Agent sends the agent token for authentication</li>
        <li>Agent sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">REGISTER &lt;port&gt;</code>, or includes <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">UDP</code> for a UDP tunnel</li>
        <li>Server checks port availability and confirms</li>
        <li>Server starts listening on the public port</li>
      </ol>

      <h2 id="incoming" className="text-xl font-semibold mt-10 mb-4">Incoming connection</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
        <li>Public user connects to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">SERVER_IP:PUBLIC_PORT</code> over TCP, or sends a datagram over UDP</li>
        <li>Server generates a UUID (e.g., <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">8bab2f9a-b0e2-4db2-8fed-9a8dda8e3aed</code>)</li>
        <li>Server sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">CONNECT &lt;uuid&gt;</code> to the agent</li>
        <li>Agent connects to the local service on the target port</li>
        <li>Agent opens a new connection to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">SERVER_IP:9001</code></li>
        <li>Agent sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">DATA &lt;uuid&gt;</code></li>
        <li>Server matches the UUID and bridges the connections</li>
        <li>TCP traffic flows bidirectionally; UDP datagrams are framed over the TCP data connection</li>
      </ol>
      <CodeBlock language="text">{`Public User <--> Server:PUBLIC_PORT <--> Server:9001 <--> Agent <--> Local Service`}</CodeBlock>

      <h2 id="teardown" className="text-xl font-semibold mt-10 mb-4">Teardown</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>When the public user disconnects, the data connection is closed</li>
        <li>When the agent disconnects from the control channel, the server releases the public port and closes all associated data connections</li>
        <li>Port ownership is removed, making the port available for other agents</li>
      </ul>
    </div>
  );
}
