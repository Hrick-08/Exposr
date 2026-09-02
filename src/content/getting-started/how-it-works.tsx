import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'How Exposr Works',
  description: 'Understand the reverse tunneling architecture and connection flow.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'connection-flow', text: 'Connection flow', level: 2 },
  { id: 'port-registration', text: 'Port registration', level: 2 },
  { id: 'data-forwarding', text: 'Data forwarding', level: 2 },
  { id: 'multiple-connections', text: 'Multiple connections', level: 2 },
];

export default function HowItWorksPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr uses a relay server architecture. The client (agent) initiates an outbound TCP connection to the server. This is important because it means the client doesn't need any inbound ports open — it works behind NAT and firewalls.
      </p>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        The relay server has two internal ports: a control port (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9000</code>) for managing tunnels, and a data port (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9001</code>) for forwarding traffic.
      </p>

      <h2 id="connection-flow" className="text-xl font-semibold mt-10 mb-4">Connection flow</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Here is the step-by-step flow when you run <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr expose 3000</code>:
      </p>

      <div className="space-y-4 mb-6">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">1</div>
          <div>
            <p className="text-foreground font-medium">Agent connects to control port</p>
            <p className="text-sm text-muted-foreground">The client creates a persistent TCP connection to <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">SERVER_IP:9000</code> and sends the agent token for authentication.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">2</div>
          <div>
            <p className="text-foreground font-medium">Agent registers a public port</p>
            <p className="text-sm text-muted-foreground">The agent sends <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">REGISTER 25565</code> to request a public port. The server checks availability and confirms.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">3</div>
          <div>
            <p className="text-foreground font-medium">Server starts listening</p>
            <p className="text-sm text-muted-foreground">The server begins accepting public connections on the registered port (e.g., <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">SERVER_IP:25565</code>).</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">4</div>
          <div>
            <p className="text-foreground font-medium">Internet user connects</p>
            <p className="text-sm text-muted-foreground">An external user connects to the public port. The server generates a UUID for this connection.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">5</div>
          <div>
            <p className="text-foreground font-medium">Server notifies the agent</p>
            <p className="text-sm text-muted-foreground">The server sends <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">CONNECT &lt;connection-id&gt;</code> over the control channel.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">6</div>
          <div>
            <p className="text-foreground font-medium">Agent creates data connection</p>
            <p className="text-sm text-muted-foreground">The agent connects to <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">SERVER_IP:9001</code> and identifies itself with <code className="text-xs bg-code-bg px-1 py-0.5 rounded font-mono text-accent">DATA &lt;connection-id&gt;</code>.</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">7</div>
          <div>
            <p className="text-foreground font-medium">Traffic flows bidirectionally</p>
            <p className="text-sm text-muted-foreground">The server connects the public socket to the data connection. All TCP data is forwarded in both directions between the internet user and the local service.</p>
          </div>
        </div>
      </div>

      <h2 id="port-registration" className="text-xl font-semibold mt-10 mb-4">Port registration</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When no public port is specified, Exposr follows this strategy:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
        <li>Try the default preferred port: <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">25565</code></li>
        <li>If unavailable, pick a random port from <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">20000-30000</code></li>
        <li>Send the port to the server for registration</li>
        <li>If still unavailable, try another random port (up to 100 attempts)</li>
      </ol>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When a public port is explicitly specified with the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">to</code> keyword, Exposr requests that exact port and does not fall back.
      </p>
      <CodeBlock language="bash">{`# Default port assignment
exposr expose 3000

# Explicit port
exposr expose 3000 to 21342`}</CodeBlock>

      <h2 id="data-forwarding" className="text-xl font-semibold mt-10 mb-4">Data forwarding</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Each incoming public connection receives its own dedicated data tunnel. The agent opens a new connection to port <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9001</code> for every public connection, identified by a UUID. Simultaneously, the agent connects to the local service on the specified port.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Traffic is forwarded using Python asyncio — data read from one socket is immediately written to the other, creating a transparent bidirectional pipe.
      </p>

      <h2 id="multiple-connections" className="text-xl font-semibold mt-10 mb-4">Multiple connections</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Multiple users can connect to the same public port simultaneously. Each connection gets a unique UUID and a separate data tunnel:
      </p>
      <CodeBlock language="text">{`Client A --+
           |
Client B --+----> Exposr Server
           |             |
Client C --+             +-- Tunnel A --> Local Service
                         +-- Tunnel B --> Local Service
                         +-- Tunnel C --> Local Service`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The server also supports multiple agents, each owning different public ports.
      </p>
    </div>
  );
}
