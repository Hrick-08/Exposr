import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Server Commands',
  description: 'Commands for managing the Exposr relay server.',
};

export const headings = [
  { id: 'init-token', text: 'exposr server init-token', level: 2 },
  { id: 'start', text: 'exposr server start', level: 2 },
  { id: 'server-config', text: 'Server configuration', level: 2 },
];

export default function ServerCommandsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="init-token" className="text-xl font-semibold mt-10 mb-4 font-mono">exposr server init-token</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Initialize the server with an agent authentication token. The server must have a token configured before it can accept agents.
      </p>
      <CodeBlock language="bash">{`exposr server init-token PASTE_TOKEN_HERE`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        This writes the token to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code> on the server while preserving other configuration values.
      </p>

      <h2 id="start" className="text-xl font-semibold mt-10 mb-4 font-mono">exposr server start</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Start the Exposr relay server:
      </p>
      <CodeBlock language="bash">{`exposr server start`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        The server starts listening on the control port (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9000</code>) and data port (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">9001</code>).
      </p>
      <Callout type="warning">
        The server must be initialized with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server init-token</code> before starting. Without a token, the server cannot authenticate connecting agents.
      </Callout>

      <h2 id="server-config" className="text-xl font-semibold mt-10 mb-4">Server configuration</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The server stores its configuration in <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code>:
      </p>
      <CodeBlock language="json" filename="~/.exposr/config.json">{`{
  "server_host": "",
  "agent_token": "YOUR_AGENT_TOKEN"
}`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">agent_token</code> field must match the token used by connecting clients.
      </p>
    </div>
  );
}
