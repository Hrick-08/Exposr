import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Public Ports',
  description: 'How public ports work in Exposr.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'port-table', text: 'Port table', level: 2 },
  { id: 'ownership', text: 'Port ownership', level: 2 },
];

export default function PublicPortsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Public ports are the externally accessible ports on the relay server that internet users connect to. Each active tunnel owns one public port. The relay server listens on these ports and forwards incoming traffic through the tunnel to the local service.
      </p>

      <h2 id="port-table" className="text-xl font-semibold mt-10 mb-4">Port table</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Port</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9000</td>
              <td className="py-2">Control channel (agent ↔ server)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9001</td>
              <td className="py-2">Data channel (per-connection tunnels)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">25565</td>
              <td className="py-2">Default preferred public port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">20000–30000</td>
              <td className="py-2">Dynamic fallback public port range</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="ownership" className="text-xl font-semibold mt-10 mb-4">Port ownership</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The server tracks which agent owns each public port. A port can only be used by one agent at a time. When an agent disconnects, its port is released and becomes available for other agents.
      </p>
      <Callout type="note">
        All public ports and the full dynamic range must be allowed through the relay server&apos;s firewall or cloud security group for external users to reach exposed services.
      </Callout>
    </div>
  );
}
