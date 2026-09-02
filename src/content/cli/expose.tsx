import { CodeBlock } from '@/components/docs/code-block';
import { Terminal } from '@/components/docs/terminal';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'exposr expose',
  description: 'Expose a local TCP service through an Exposr relay server.',
};

export const headings = [
  { id: 'usage', text: 'Usage', level: 2 },
  { id: 'arguments', text: 'Arguments', level: 2 },
  { id: 'options', text: 'Options', level: 2 },
  { id: 'port-assignment', text: 'Port assignment', level: 2 },
  { id: 'examples', text: 'Examples', level: 2 },
  { id: 'output', text: 'Output', level: 2 },
  { id: 'errors', text: 'Errors', level: 2 },
];

export default function ExposePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 font-mono">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="usage" className="text-xl font-semibold mt-10 mb-4">Usage</h2>
      <CodeBlock language="bash">{`exposr expose <local-port> [to <public-port>]`}</CodeBlock>

      <h2 id="arguments" className="text-xl font-semibold mt-10 mb-4">Arguments</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Argument</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Required</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">&lt;local-port&gt;</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">The local port to forward traffic to</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">to &lt;public-port&gt;</td>
              <td className="py-2 pr-4">No</td>
              <td className="py-2">Specific public port to request</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="options" className="text-xl font-semibold mt-10 mb-4">Options</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Option</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Default</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--server-host</td>
              <td className="py-2 pr-4">Saved config</td>
              <td className="py-2">Override the relay server address</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--control-port</td>
              <td className="py-2 pr-4">9000</td>
              <td className="py-2">Control channel port on the server</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--data-port</td>
              <td className="py-2 pr-4">9001</td>
              <td className="py-2">Data channel port on the server</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--local-host</td>
              <td className="py-2 pr-4">127.0.0.1</td>
              <td className="py-2">Local host to forward to</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="port-assignment" className="text-xl font-semibold mt-10 mb-4">Port assignment</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When no public port is specified, Exposr tries port <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">25565</code> first. If unavailable, it picks random ports from <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">20000-30000</code> and checks each with the server, up to 100 attempts.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When a public port is explicitly specified with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">to</code>, Exposr requests that exact port without fallback.
      </p>

      <h2 id="examples" className="text-xl font-semibold mt-10 mb-4">Examples</h2>
      <CodeBlock language="bash">{`# Expose local port 3000 with automatic port assignment
exposr expose 3000

# Expose local port 3000 on public port 21342
exposr expose 3000 to 21342

# Expose local port 8080
exposr expose 8080

# Expose Minecraft server
exposr expose 25565

# Override server address for one run
exposr expose 3000 --server-host 10.0.0.5`}</CodeBlock>

      <h2 id="output" className="text-xl font-semibold mt-10 mb-4">Output</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        On successful connection, Exposr displays:
      </p>
      <Terminal title="exposr">{`[TRYING] Connecting to Exposr server
[CONNECTED] Connected to Exposr control server
[TRYING] Registering public port
[CONNECTED] Tunnel active

Public address:
  20.198.81.254:25565

Forwarding to:
  127.0.0.1:3000`}</Terminal>

      <h2 id="errors" className="text-xl font-semibold mt-10 mb-4">Errors</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the server is not configured:
      </p>
      <CodeBlock language="text">{`[ERROR] Server IP is not configured. Run: exposr config set-server <server-ip>`}</CodeBlock>
      <Callout type="tip">
        Run <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr config set-server YOUR_SERVER_IP</code> to save the server address before using <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">expose</code>.
      </Callout>
    </div>
  );
}
