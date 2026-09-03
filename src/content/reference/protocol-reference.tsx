import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Protocol Reference',
  description: 'Complete reference for the Exposr protocol.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'control-messages', text: 'Control channel messages', level: 2 },
  { id: 'data-messages', text: 'Data channel messages', level: 2 },
  { id: 'ports', text: 'Default ports', level: 2 },
];

export default function ProtocolReferencePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr uses a simple text-based protocol. Messages are sent as UTF-8 text, one per line, terminated by a newline character.
      </p>

      <h2 id="control-messages" className="text-xl font-semibold mt-10 mb-4">Control channel messages</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Sent over the persistent connection to port 9000.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Message</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Direction</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">&lt;token&gt;</td>
              <td className="py-2 pr-4">Agent → Server</td>
              <td className="py-2">Authentication token (sent on connect)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">REGISTER &lt;port&gt; [&lt;token&gt; UDP]</td>
              <td className="py-2 pr-4">Agent → Server</td>
              <td className="py-2">Request a TCP or UDP public port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">CONNECT &lt;uuid&gt;</td>
              <td className="py-2 pr-4">Server → Agent</td>
              <td className="py-2">Notify agent of an incoming public connection</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="data-messages" className="text-xl font-semibold mt-10 mb-4">Data channel messages</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Sent over per-connection TCP connections to port 9001.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Message</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Direction</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">DATA &lt;uuid&gt;</td>
              <td className="py-2 pr-4">Agent → Server</td>
              <td className="py-2">Identify data connection (first message only)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        After the identification message, TCP connections become raw pipes. UDP payloads are transported as length-prefixed frames over the TCP data connection and are sent to the local UDP service as datagrams.
      </p>

      <h2 id="ports" className="text-xl font-semibold mt-10 mb-4">Default ports</h2>
      <CodeBlock language="text">{`Control channel:    9000
Data channel:       9001
Default public:     25565
Fallback range:     20000-30000`}</CodeBlock>
    </div>
  );
}
