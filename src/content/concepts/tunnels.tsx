import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Tunnels',
  description: 'Understanding TCP and UDP tunnels in Exposr.',
};

export const headings = [
  { id: 'what-is-a-tunnel', text: 'What is a tunnel?', level: 2 },
  { id: 'tunnel-lifecycle', text: 'Tunnel lifecycle', level: 2 },
  { id: 'limitations', text: 'Current limitations', level: 2 },
];

export default function TunnelsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="what-is-a-tunnel" className="text-xl font-semibold mt-10 mb-4">What is a tunnel?</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        In Exposr, a tunnel is a logical connection between a public port on the relay server and a local service on the client machine. TCP tunnels forward stream traffic, while UDP tunnels forward datagrams through the relay server and Exposr agent.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        A tunnel consists of two parts: a persistent control connection that manages the tunnel lifecycle, and one or more data connections that carry the actual traffic.
      </p>

      <h2 id="tunnel-lifecycle" className="text-xl font-semibold mt-10 mb-4">Tunnel lifecycle</h2>
      <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-6">
        <li>The agent connects to the control port and authenticates</li>
        <li>The agent requests a public port (tunnel registration)</li>
        <li>The server starts listening on the public port</li>
        <li>The tunnel is now active — public connections are forwarded</li>
        <li>When the agent disconnects, the server releases the public port</li>
      </ol>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If the agent disconnects unexpectedly, the server detects the broken control connection and cleans up the associated tunnel, releasing the public port for reuse.
      </p>

      <h2 id="limitations" className="text-xl font-semibold mt-10 mb-4">Current limitations</h2>
      <Callout type="experimental">
        Exposr v0.5 supports TCP and UDP tunnels. HTTPS termination and domain-based routing are planned features.
      </Callout>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        <li>UDP payloads use temporary TCP data connections and length-prefixed frames</li>
        <li>One tunnel per agent (one public port per control connection)</li>
        <li>No persistent tunnel configuration — tunnels exist only while the agent is connected</li>
        <li>No connection keep-alive or pooling for data connections</li>
      </ul>
    </div>
  );
}
