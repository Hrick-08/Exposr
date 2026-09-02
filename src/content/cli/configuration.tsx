import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Configuration',
  description: 'Configure the Exposr client.',
};

export const headings = [
  { id: 'set-server', text: 'Set server address', level: 2 },
  { id: 'agent-token', text: 'Agent token', level: 2 },
  { id: 'config-location', text: 'Configuration files', level: 2 },
];

export default function ConfigurationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="set-server" className="text-xl font-semibold mt-10 mb-4">Set server address</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Before using <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr expose</code>, you must configure the relay server address:
      </p>
      <CodeBlock language="bash">{`exposr config set-server YOUR_SERVER_IP`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        For example:
      </p>
      <CodeBlock language="bash">{`exposr config set-server 20.198.81.254`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The address is saved to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code> and used for all subsequent <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">expose</code> commands. You can override it per-run with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">--server-host</code>.
      </p>

      <h2 id="agent-token" className="text-xl font-semibold mt-10 mb-4">Agent token</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When you run <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr config set-server</code>, a random agent token is generated and saved to:
      </p>
      <CodeBlock language="text">{`~/.exposr/agent_token.txt`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        This token is sent with every control registration request. The server must be configured with the same token — it will reject connections with mismatched tokens.
      </p>
      <Callout type="note">
        Copy the contents of <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code> and use <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server init-token PASTE_TOKEN_HERE</code> on the relay server to complete the authentication setup.
      </Callout>

      <h2 id="config-location" className="text-xl font-semibold mt-10 mb-4">Configuration files</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">File</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">~/.exposr/config.json</td>
              <td className="py-2">Server address and client settings</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">~/.exposr/agent_token.txt</td>
              <td className="py-2">Agent authentication token</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
