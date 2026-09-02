import { CodeBlock } from '@/components/docs/code-block';
import { Terminal } from '@/components/docs/terminal';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Quick Start',
  description: 'Get a local service publicly accessible in a few steps.',
};

export const headings = [
  { id: 'install', text: '1. Install Exposr', level: 2 },
  { id: 'configure', text: '2. Configure the relay server', level: 2 },
  { id: 'start-app', text: '3. Start your local application', level: 2 },
  { id: 'expose', text: '4. Expose it', level: 2 },
  { id: 'access', text: '5. Access from the internet', level: 2 },
];

export default function QuickStartPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="install" className="text-xl font-semibold mt-10 mb-4">1. Install Exposr</h2>
      <CodeBlock language="bash">{`git clone https://github.com/Hrick-08/Exposr.git
cd Exposr
python -m pip install .`}</CodeBlock>

      <h2 id="configure" className="text-xl font-semibold mt-10 mb-4">2. Configure the relay server</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Set the IP address of your Exposr relay server. This also generates a random agent token and saves it to <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code>:
      </p>
      <CodeBlock language="bash">{`exposr config set-server YOUR_SERVER_IP`}</CodeBlock>
      <Callout type="note">
        You need access to a machine running the Exposr server. See the "Using Your Own Relay Server" guide for setup instructions.
      </Callout>

      <h2 id="start-app" className="text-xl font-semibold mt-10 mb-4">3. Start your local application</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Start any TCP service on your local machine. For example, a Python HTTP server:
      </p>
      <CodeBlock language="bash">{`python -m http.server 3000`}</CodeBlock>

      <h2 id="expose" className="text-xl font-semibold mt-10 mb-4">4. Expose it</h2>
      <CodeBlock language="bash">{`exposr expose 3000`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        You should see output similar to:
      </p>
      <Terminal title="exposr">{`[TRYING] Connecting to Exposr server
[CONNECTED] Connected to Exposr control server
[TRYING] Registering public port
[CONNECTED] Tunnel active

Public address:
  20.198.81.254:25565

Forwarding to:
  127.0.0.1:3000`}</Terminal>

      <h2 id="access" className="text-xl font-semibold mt-10 mb-4">5. Access from the internet</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Anyone can now access your local service at the public address shown. For a web server:
      </p>
      <CodeBlock language="text">{`http://SERVER_IP:25565`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Traffic arriving at the public port is forwarded through the Exposr tunnel to your local service on port 3000.
      </p>
    </div>
  );
}
