import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Control Connection',
  description: 'The persistent TCP connection between agent and server.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'authentication', text: 'Authentication', level: 2 },
  { id: 'messages', text: 'Protocol messages', level: 2 },
  { id: 'reconnection', text: 'Reconnection', level: 2 },
];

export default function ControlConnectionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The control connection is a persistent TCP connection from the agent to the relay server on port <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9000</code>. It is established when the agent starts and remains open for the lifetime of the tunnel.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        This connection serves as the command channel: the agent uses it to register tunnels, and the server uses it to notify the agent of incoming public connections.
      </p>

      <h2 id="authentication" className="text-xl font-semibold mt-10 mb-4">Authentication</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When the control connection is established, the agent sends its agent token. The server validates the token against its configured value. If the token does not match, the server closes the connection before accepting the agent or opening a public tunnel.
      </p>

      <h2 id="messages" className="text-xl font-semibold mt-10 mb-4">Protocol messages</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The control connection uses a simple text-based protocol:
      </p>
      <CodeBlock language="text">{`# Agent -> Server: Register a public port
REGISTER 25565

# Server -> Agent: Incoming public connection
CONNECT 8bab2f9a-b0e2-4db2-8fed-9a8dda8e3aed`}</CodeBlock>

      <h2 id="reconnection" className="text-xl font-semibold mt-10 mb-4">Reconnection</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the control connection drops, the agent automatically attempts to reconnect. Upon successful reconnection, the agent re-registers its public port.
      </p>
    </div>
  );
}
