import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Server Configuration',
  description: 'Configure the Exposr relay server.',
};

export const headings = [
  { id: 'config-file', text: 'Configuration file', level: 2 },
  { id: 'token-setup', text: 'Token setup', level: 2 },
  { id: 'ports', text: 'Default ports', level: 2 },
];

export default function ServerConfigurationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="config-file" className="text-xl font-semibold mt-10 mb-4">Configuration file</h2>
      <CodeBlock language="json" filename="~/.exposr/config.json">{`{
  "server_host": "",
  "agent_token": "YOUR_AGENT_TOKEN"
}`}</CodeBlock>

      <h2 id="token-setup" className="text-xl font-semibold mt-10 mb-4">Token setup</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Initialize the token on the server:
      </p>
      <CodeBlock language="bash">{`exposr server init-token YOUR_TOKEN`}</CodeBlock>
      <Callout type="warning">
        The server must be initialized with a token before it can accept agents. Without a matching token, all agent connections will be rejected.
      </Callout>

      <h2 id="ports" className="text-xl font-semibold mt-10 mb-4">Default ports</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Port</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9000</td>
              <td className="py-2">Agent control channel</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9001</td>
              <td className="py-2">Data tunnel connections</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">25565</td>
              <td className="py-2">Default preferred public port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">20000–30000</td>
              <td className="py-2">Dynamic fallback range</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
