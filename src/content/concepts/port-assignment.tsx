import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Port Assignment',
  description: 'How Exposr assigns public ports for tunnels.',
};

export const headings = [
  { id: 'automatic', text: 'Automatic assignment', level: 2 },
  { id: 'explicit', text: 'Explicit assignment', level: 2 },
  { id: 'algorithm', text: 'Assignment algorithm', level: 2 },
];

export default function PortAssignmentPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="automatic" className="text-xl font-semibold mt-10 mb-4">Automatic assignment</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        When no public port is specified, Exposr automatically assigns one:
      </p>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">
        <li>First, try port <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">25565</code></li>
        <li>If taken, pick a random port from <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">20000–30000</code></li>
        <li>Send the port to the server for registration verification</li>
        <li>If the server confirms it&apos;s available, use it</li>
        <li>If not, try another random port (up to 100 attempts)</li>
      </ol>
      <CodeBlock language="bash">{`# Automatic port assignment
exposr expose 3000`}</CodeBlock>

      <h2 id="explicit" className="text-xl font-semibold mt-10 mb-4">Explicit assignment</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        You can request a specific public port with the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">to</code> keyword. Exposr requests that exact port without fallback:
      </p>
      <CodeBlock language="bash">{`# Request specific public port 21342
exposr expose 3000 to 21342`}</CodeBlock>

      <h2 id="algorithm" className="text-xl font-semibold mt-10 mb-4">Assignment algorithm</h2>
      <CodeBlock language="text">{`25565
  |
  v
available?
  |
  +-- yes -> register tunnel
  |
  +-- no
        |
        v
random port from 20000-30000
        |
        v
available?
  |
  +-- yes -> register tunnel
  |
  +-- no -> try another random port (up to 100 attempts)`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Random ports are verified with the server — a port is not assumed available just because it was randomly selected.
      </p>
    </div>
  );
}
