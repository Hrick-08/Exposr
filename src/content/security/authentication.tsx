import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Authentication',
  description: 'How Exposr authenticates agents.',
};

export const headings = [
  { id: 'agent-tokens', text: 'Agent tokens', level: 2 },
  { id: 'setup', text: 'Setting up authentication', level: 2 },
  { id: 'data-channel', text: 'Data channel authentication', level: 2 },
];

export default function AuthenticationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="agent-tokens" className="text-xl font-semibold mt-10 mb-4">Agent tokens</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr uses a shared token for authenticating agents on the control channel. The agent sends its token when connecting to port 9000, and the server validates it against its configured token. Connections with mismatched tokens are rejected before any tunnel operations are allowed.
      </p>

      <h2 id="setup" className="text-xl font-semibold mt-10 mb-4">Setting up authentication</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        On the client, run:
      </p>
      <CodeBlock language="bash">{`exposr config set-server YOUR_SERVER_IP`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        This generates a random token and saves it to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code>. Then on the server:
      </p>
      <CodeBlock language="bash">{`exposr server init-token PASTE_TOKEN_HERE`}</CodeBlock>

      <h2 id="data-channel" className="text-xl font-semibold mt-10 mb-4">Data channel authentication</h2>
      <Callout type="experimental">
        Data connections on port 9001 are not currently authenticated separately. The data channel relies on UUID matching only. Per-data-connection authentication is a planned improvement.
      </Callout>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Currently, when an agent connects to port 9001 and sends <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">DATA &lt;uuid&gt;</code>, the server matches the UUID with a pending connection. There is no separate token validation on the data channel.
      </p>
    </div>
  );
}
