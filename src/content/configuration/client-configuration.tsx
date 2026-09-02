import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Client Configuration',
  description: 'Configure the Exposr client.',
};

export const headings = [
  { id: 'config-file', text: 'Configuration file', level: 2 },
  { id: 'agent-token', text: 'Agent token', level: 2 },
  { id: 'cli-overrides', text: 'CLI overrides', level: 2 },
];

export default function ClientConfigurationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="config-file" className="text-xl font-semibold mt-10 mb-4">Configuration file</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Client configuration is stored in:
      </p>
      <CodeBlock language="text">{`~/.exposr/config.json`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">Example contents:</p>
      <CodeBlock language="json" filename="~/.exposr/config.json">{`{
  "server_host": "20.198.81.254"
}`}</CodeBlock>

      <h2 id="agent-token" className="text-xl font-semibold mt-10 mb-4">Agent token</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The agent token is stored separately:
      </p>
      <CodeBlock language="text">{`~/.exposr/agent_token.txt`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        This token is generated automatically when you run <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr config set-server</code> and is sent with every control registration request.
      </p>

      <h2 id="cli-overrides" className="text-xl font-semibold mt-10 mb-4">CLI overrides</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        You can override saved settings per-run:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Flag</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Default</th>
              <th className="text-left py-2 font-medium text-foreground">Description</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--server-host</td>
              <td className="py-2 pr-4">config.json</td>
              <td className="py-2">Server address</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--control-port</td>
              <td className="py-2 pr-4">9000</td>
              <td className="py-2">Control port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--data-port</td>
              <td className="py-2 pr-4">9001</td>
              <td className="py-2">Data port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">--local-host</td>
              <td className="py-2 pr-4">127.0.0.1</td>
              <td className="py-2">Local host to forward to</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
