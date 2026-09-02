import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Custom Public Ports',
  description: 'Choose your own public port for an exposed service.',
};

export const headings = [
  { id: 'syntax', text: 'Syntax', level: 2 },
  { id: 'examples', text: 'Examples', level: 2 },
  { id: 'considerations', text: 'Considerations', level: 2 },
];

export default function CustomPublicPortsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="syntax" className="text-xl font-semibold mt-10 mb-4">Syntax</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Use the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">to</code> keyword to specify an exact public port:
      </p>
      <CodeBlock language="bash">{`exposr expose <local-port> to <public-port>`}</CodeBlock>

      <h2 id="examples" className="text-xl font-semibold mt-10 mb-4">Examples</h2>
      <CodeBlock language="bash">{`# Expose local port 3000 on public port 21342
exposr expose 3000 to 21342

# Expose local port 8080 on public port 25000
exposr expose 8080 to 25000

# Expose Minecraft on its default port
exposr expose 25565 to 25565`}</CodeBlock>

      <h2 id="considerations" className="text-xl font-semibold mt-10 mb-4">Considerations</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
        <li>The requested public port must be available on the server</li>
        <li>The port must be allowed through the server&apos;s firewall</li>
        <li>When specifying a custom port, Exposr does not fall back to a random port if it&apos;s unavailable</li>
      </ul>
      <Callout type="tip">
        For ports outside the default <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">20000–30000</code> range, make sure the port is also allowed through your server&apos;s firewall or cloud security group.
      </Callout>
    </div>
  );
}
