import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'TLS and HTTPS',
  description: 'Encryption support in Exposr.',
};

export const headings = [
  { id: 'current-state', text: 'Current state', level: 2 },
  { id: 'planned', text: 'Planned support', level: 2 },
];

export default function TlsAndHttpsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <Callout type="experimental" title="Coming Soon">
        TLS and HTTPS support are planned features and are not available in Exposr v0.5.
      </Callout>

      <h2 id="current-state" className="text-xl font-semibold mt-10 mb-4">Current state</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr v0.5 transmits tunnel traffic without encryption. The control and data channels use TCP, while public tunnels may use TCP or UDP:
      </p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Control channel (port 9000) — unencrypted</li>
        <li>Data channel (port 9001) — unencrypted</li>
        <li>Public ports — unencrypted</li>
      </ul>
      <Callout type="warning">
        Do not transmit sensitive data through Exposr tunnels without your own encryption layer (e.g., the tunneled application itself using HTTPS).
      </Callout>

      <h2 id="planned" className="text-xl font-semibold mt-10 mb-4">Planned support</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Future versions plan to add:
      </p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        <li>TLS encryption on the control channel</li>
        <li>TLS encryption on data connections</li>
        <li>HTTPS termination at the relay server</li>
        <li>Automatic certificate management</li>
      </ul>
    </div>
  );
}
