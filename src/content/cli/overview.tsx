import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'CLI Overview',
  description: 'Overview of the Exposr command-line interface.',
};

export const headings = [
  { id: 'commands', text: 'Commands', level: 2 },
  { id: 'global-options', text: 'Global options', level: 2 },
  { id: 'examples', text: 'Examples', level: 2 },
];

export default function CLIOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        The Exposr CLI is installed as the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr</code> command. It provides commands for exposing local services, configuring the client, and managing the relay server.
      </p>

      <h2 id="commands" className="text-xl font-semibold mt-10 mb-4">Commands</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Command</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">exposr tcp &lt;local-port&gt; [public-port]</td>
              <td className="py-2">Expose a local TCP service through the relay</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">exposr udp &lt;local-port&gt; [public-port]</td>
              <td className="py-2">Expose a local UDP service through the relay</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">exposr config set-server &lt;ip&gt;</td>
              <td className="py-2">Configure the relay server address</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">exposr server init-token &lt;token&gt;</td>
              <td className="py-2">Initialize the server with an agent token</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">exposr server start</td>
              <td className="py-2">Start the relay server</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="global-options" className="text-xl font-semibold mt-10 mb-4">Global options</h2>
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
              <td className="py-2">Override the server address for one run</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--control-port</td>
              <td className="py-2 pr-4">9000</td>
              <td className="py-2">Control channel port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--data-port</td>
              <td className="py-2 pr-4">9001</td>
              <td className="py-2">Data channel port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--local-host</td>
              <td className="py-2 pr-4">127.0.0.1</td>
              <td className="py-2">Local host address</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="examples" className="text-xl font-semibold mt-10 mb-4">Examples</h2>
        <CodeBlock language="bash">{`# Expose a local TCP service on the default public port
exposr tcp 3000

# Expose a local TCP service with a specific public port
exposr tcp 3000 21342

# Expose a local UDP service
exposr udp 3000 21342

# Use a different server for one run
exposr tcp 3000 --server-host 10.0.0.5

# Expose a service on port 8080
exposr tcp 8080`}</CodeBlock>
    </div>
  );
}
