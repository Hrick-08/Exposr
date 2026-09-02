import { CodeBlock } from '@/components/docs/code-block';
import { Terminal } from '@/components/docs/terminal';

export const meta = {
  title: 'Expose a Local Web App',
  description: 'Make a local web application accessible from the internet.',
};

export const headings = [
  { id: 'prerequisites', text: 'Prerequisites', level: 2 },
  { id: 'start-app', text: 'Start your web app', level: 2 },
  { id: 'expose', text: 'Expose it', level: 2 },
  { id: 'access', text: 'Access from the internet', level: 2 },
];

export default function ExposeWebAppPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="prerequisites" className="text-xl font-semibold mt-10 mb-4">Prerequisites</h2>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Exposr CLI installed and configured</li>
        <li>A running Exposr relay server</li>
        <li>A local web application</li>
      </ul>

      <h2 id="start-app" className="text-xl font-semibold mt-10 mb-4">Start your web app</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Start your web application locally. For example, a simple Python HTTP server:
      </p>
      <CodeBlock language="bash">{`python -m http.server 3000`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Or a Node.js application:
      </p>
      <CodeBlock language="bash">{`node server.js  # listening on port 3000`}</CodeBlock>

      <h2 id="expose" className="text-xl font-semibold mt-10 mb-4">Expose it</h2>
      <CodeBlock language="bash">{`exposr expose 3000`}</CodeBlock>
      <Terminal title="exposr">{`[TRYING] Connecting to Exposr server
[CONNECTED] Connected to Exposr control server
[TRYING] Registering public port
[CONNECTED] Tunnel active

Public address:
  20.198.81.254:25565

Forwarding to:
  127.0.0.1:3000`}</Terminal>

      <h2 id="access" className="text-xl font-semibold mt-10 mb-4">Access from the internet</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Open a browser and navigate to:
      </p>
      <CodeBlock language="text">{`http://SERVER_IP:25565`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The request is forwarded through the Exposr tunnel to your local web server on port 3000.
      </p>
    </div>
  );
}
