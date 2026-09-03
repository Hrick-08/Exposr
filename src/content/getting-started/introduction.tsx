import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';
import { ArchitectureDiagram } from '@/components/docs/architecture-diagram';

export const meta = {
  title: 'Introduction',
  description: 'Expose local services to the internet through a reverse tunnel.',
};

export const headings = [
  { id: 'what-is-exposr', text: 'What is Exposr?', level: 2 },
  { id: 'how-it-works', text: 'How it works', level: 2 },
  { id: 'architecture', text: 'Architecture', level: 2 },
  { id: 'use-cases', text: 'Use cases', level: 2 },
  { id: 'current-status', text: 'Current status', level: 2 },
];

export default function IntroductionPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Exposr</h1>
      <p className="text-muted-foreground text-lg mb-8">
        Expose local services to the internet through a secure reverse tunnel.
      </p>

      <Callout type="experimental">
        Exposr v0.5 is currently an experimental proof of concept. The core tunneling functionality works, but some features like TLS encryption and per-connection authentication are not yet implemented.
      </Callout>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        Exposr is a reverse tunneling tool that allows developers to expose TCP and UDP services running on their local machine through a publicly accessible relay server. It uses a persistent control connection and creates dedicated data tunnels for each incoming public connection.
      </p>

      <h2 id="what-is-exposr" className="text-xl font-semibold mt-10 mb-4">What is Exposr?</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr is a lightweight reverse TCP and UDP tunnel built with Python and asyncio. It lets you take a service running on <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">127.0.0.1</code> and make it accessible from the public internet through a relay server.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        With a single command, your local web server, API, game server, or UDP service becomes reachable at a public IP address and port.
      </p>
      <CodeBlock language="bash">exposr tcp 3000 25565</CodeBlock>

      <h2 id="how-it-works" className="text-xl font-semibold mt-10 mb-4">How it works</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
        <li>Your application runs locally (e.g., <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">127.0.0.1:3000</code>)</li>
        <li>The Exposr client creates an outbound connection to the relay server</li>
        <li>The client authenticates with an agent token and registers a public port</li>
        <li>When someone connects to the public port, the server notifies the client</li>
        <li>A dedicated data connection is created for each public connection</li>
        <li>Traffic flows bidirectionally between the public user and your local service</li>
      </ol>

      <h2 id="architecture" className="text-xl font-semibold mt-10 mb-4">Architecture</h2>
      <ArchitectureDiagram />

      <h2 id="use-cases" className="text-xl font-semibold mt-10 mb-4">Use cases</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
        <li>Share a local development server with teammates or clients</li>
        <li>Test webhooks from external services against a local server</li>
        <li>Expose a local game server (e.g., Minecraft on port 25565)</li>
        <li>Demo a local application without deploying</li>
        <li>Access a service behind NAT or a firewall</li>
      </ul>

      <h2 id="current-status" className="text-xl font-semibold mt-10 mb-4">Current status</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr v0.5 supports:
      </p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-4">
        <li>Reverse TCP tunneling</li>
        <li>Reverse UDP tunneling with datagram forwarding</li>
        <li>Dynamic public port registration with automatic fallback</li>
        <li>Agent token authentication on the control channel</li>
        <li>Multiple simultaneous public connections</li>
        <li>Dedicated data tunnel per connection</li>
        <li>Automatic agent reconnection</li>
        <li>Command-line interface</li>
      </ul>
      <Callout type="note">
        Features like TLS encryption, domain routing, and per-data-connection authentication are planned but not yet implemented. See the Security section for details.
      </Callout>
    </div>
  );
}
