import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Protocol',
  description: 'The Exposr control and data channel protocol.',
};

export const headings = [
  { id: 'control-protocol', text: 'Control protocol', level: 2 },
  { id: 'data-protocol', text: 'Data protocol', level: 2 },
  { id: 'message-reference', text: 'Message reference', level: 2 },
];

export default function ProtocolPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="control-protocol" className="text-xl font-semibold mt-10 mb-4">Control protocol</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The control protocol operates over the persistent TCP connection on port 9000. Messages are text-based, one per line.
      </p>
      <CodeBlock language="text">{`# Agent authenticates with token (sent on connection)
<agent-token>

# Agent registers a public port
REGISTER <port>

# Server notifies agent of a new public connection
CONNECT <connection-uuid>`}</CodeBlock>

      <h2 id="data-protocol" className="text-xl font-semibold mt-10 mb-4">Data protocol</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The data protocol operates on port 9001. Each data connection begins with an identification message. TCP tunnels then become raw TCP pipes; UDP tunnels use length-prefixed datagram frames over the TCP connection.
      </p>
      <CodeBlock language="text">{`# Agent identifies the data connection
DATA <connection-uuid>

# After identification, raw TCP data flows bidirectionally
# UDP payloads use length-prefixed frames`}</CodeBlock>

      <h2 id="message-reference" className="text-xl font-semibold mt-10 mb-4">Message reference</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Message</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Direction</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Channel</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">REGISTER &lt;port&gt;</td>
              <td className="py-2 pr-4">Agent → Server</td>
              <td className="py-2 pr-4">Control</td>
              <td className="py-2">Request a public port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">CONNECT &lt;uuid&gt;</td>
              <td className="py-2 pr-4">Server → Agent</td>
              <td className="py-2 pr-4">Control</td>
              <td className="py-2">Notify of incoming connection</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">DATA &lt;uuid&gt;</td>
              <td className="py-2 pr-4">Agent → Server</td>
              <td className="py-2 pr-4">Data</td>
              <td className="py-2">Identify a data connection</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
