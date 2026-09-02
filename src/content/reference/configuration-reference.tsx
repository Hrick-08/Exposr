import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Configuration Reference',
  description: 'Complete reference for Exposr configuration.',
};

export const headings = [
  { id: 'files', text: 'Configuration files', level: 2 },
  { id: 'client-config', text: 'Client config.json', level: 2 },
  { id: 'server-config', text: 'Server config.json', level: 2 },
  { id: 'agent-token', text: 'Agent token file', level: 2 },
];

export default function ConfigurationReferencePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="files" className="text-xl font-semibold mt-10 mb-4">Configuration files</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Path</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">~/.exposr/config.json</td>
              <td className="py-2">Server address and settings (client and server)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">~/.exposr/agent_token.txt</td>
              <td className="py-2">Agent authentication token</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="client-config" className="text-xl font-semibold mt-10 mb-4">Client config.json</h2>
      <CodeBlock language="json" filename="~/.exposr/config.json">{`{
  "server_host": "20.198.81.254"
}`}</CodeBlock>

      <h2 id="server-config" className="text-xl font-semibold mt-10 mb-4">Server config.json</h2>
      <CodeBlock language="json" filename="~/.exposr/config.json">{`{
  "server_host": "",
  "agent_token": "your-agent-token-here"
}`}</CodeBlock>

      <h2 id="agent-token" className="text-xl font-semibold mt-10 mb-4">Agent token file</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        A plain text file containing the agent token. Generated automatically by <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr config set-server</code>.
      </p>
      <CodeBlock language="text" filename="~/.exposr/agent_token.txt">{`a1b2c3d4-e5f6-7890-abcd-ef1234567890`}</CodeBlock>
    </div>
  );
}
