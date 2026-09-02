import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Using Your Own Relay Server',
  description: 'Set up and run your own Exposr relay server.',
};

export const headings = [
  { id: 'requirements', text: 'Server requirements', level: 2 },
  { id: 'install', text: 'Install Exposr on the server', level: 2 },
  { id: 'configure-token', text: 'Configure the agent token', level: 2 },
  { id: 'start-server', text: 'Start the server', level: 2 },
  { id: 'firewall', text: 'Firewall configuration', level: 2 },
  { id: 'connect-client', text: 'Connect a client', level: 2 },
];

export default function OwnRelayServerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="requirements" className="text-xl font-semibold mt-10 mb-4">Server requirements</h2>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Python 3.10+</li>
        <li>Linux server, VPS, or cloud VM (e.g., Azure, AWS, DigitalOcean)</li>
        <li>Public IP address</li>
        <li>Open inbound TCP ports: 9000, 9001, 25565, and 20000–30000</li>
      </ul>

      <h2 id="install" className="text-xl font-semibold mt-10 mb-4">Install Exposr on the server</h2>
      <CodeBlock language="bash">{`git clone https://github.com/Hrick-08/Exposr.git
cd Exposr
python3 -m pip install .`}</CodeBlock>

      <h2 id="configure-token" className="text-xl font-semibold mt-10 mb-4">Configure the agent token</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        On your local machine, run:
      </p>
      <CodeBlock language="bash">{`exposr config set-server YOUR_SERVER_IP`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        This generates a random token in <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code>. Copy the token and initialize the server:
      </p>
      <CodeBlock language="bash">{`# On the relay server:
exposr server init-token PASTE_TOKEN_HERE`}</CodeBlock>

      <h2 id="start-server" className="text-xl font-semibold mt-10 mb-4">Start the server</h2>
      <CodeBlock language="bash">{`exposr server start`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The server starts listening on ports 9000 (control) and 9001 (data).
      </p>

      <h2 id="firewall" className="text-xl font-semibold mt-10 mb-4">Firewall configuration</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Port / Range</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Protocol</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9000</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">Control channel</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9001</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">Data channel</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">20000–30000</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">Dynamic public tunnel ports</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout type="warning">
        Without allowing the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">20000–30000</code> range, Exposr may register a tunnel internally while external users cannot reach it.
      </Callout>

      <h2 id="connect-client" className="text-xl font-semibold mt-10 mb-4">Connect a client</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        From your local machine:
      </p>
      <CodeBlock language="bash">{`exposr expose 3000`}</CodeBlock>
    </div>
  );
}
