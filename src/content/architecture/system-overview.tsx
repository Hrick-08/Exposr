import { Callout } from '@/components/docs/callout';
import { ArchitectureDiagram } from '@/components/docs/architecture-diagram';

export const meta = {
  title: 'System Overview',
  description: 'High-level architecture of the Exposr tunneling system.',
};

export const headings = [
  { id: 'components', text: 'Components', level: 2 },
  { id: 'architecture-diagram', text: 'Architecture diagram', level: 2 },
  { id: 'communication', text: 'Communication', level: 2 },
];

export default function SystemOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="components" className="text-xl font-semibold mt-10 mb-4">Components</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr consists of three main components:
      </p>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
        <li><strong className="text-foreground">Client (Agent)</strong> — Runs on the user&apos;s machine. Manages the control connection, creates data tunnels, and forwards traffic to local services.</li>
        <li><strong className="text-foreground">Server (Relay)</strong> — Runs on a public server. Accepts agent connections, manages public ports, and bridges public connections to agent data tunnels.</li>
        <li><strong className="text-foreground">Common</strong> — Shared utilities for logging and protocol message parsing.</li>
      </ul>

      <h2 id="architecture-diagram" className="text-xl font-semibold mt-10 mb-4">Architecture diagram</h2>
      <ArchitectureDiagram />

      <h2 id="communication" className="text-xl font-semibold mt-10 mb-4">Communication</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        All communication is TCP-based. The agent initiates all connections outbound, meaning it works behind NAT and firewalls without requiring inbound ports on the client machine.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The system uses a text-based protocol over the control channel and raw TCP forwarding over data connections.
      </p>
    </div>
  );
}
