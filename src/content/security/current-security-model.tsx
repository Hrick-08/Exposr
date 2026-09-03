import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Current Security Model',
  description: 'Security characteristics of Exposr v0.5.',
};

export const headings = [
  { id: 'status', text: 'Status', level: 2 },
  { id: 'what-exists', text: 'What exists', level: 2 },
  { id: 'limitations', text: 'Known limitations', level: 2 },
  { id: 'planned', text: 'Planned improvements', level: 2 },
];

export default function CurrentSecurityModelPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <Callout type="caution" title="Experimental — Not Production Ready">
        Exposr v0.5 is an experimental proof of concept. Do not use it to expose sensitive services in production environments without additional security controls.
      </Callout>

      <h2 id="status" className="text-xl font-semibold mt-10 mb-4">Status</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The current version provides basic agent authentication on the control channel but lacks several security features needed for production use.
      </p>

      <h2 id="what-exists" className="text-xl font-semibold mt-10 mb-4">What exists</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
        <li><strong className="text-foreground">Agent token authentication</strong> — The control channel requires a matching agent token. The server rejects connections with invalid tokens before accepting the agent or opening tunnels.</li>
        <li><strong className="text-foreground">Port ownership tracking</strong> — The server tracks which agent owns each public port and releases ports on disconnection.</li>
      </ul>

      <h2 id="limitations" className="text-xl font-semibold mt-10 mb-4">Known limitations</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
        <li>TCP and UDP traffic are unencrypted</li>
        <li>No TLS on any channel</li>
        <li>Data connections (port 9001) are not separately authenticated</li>
        <li>No domain or subdomain routing</li>
        <li>No rate limiting or abuse protection</li>
        <li>No user accounts or access control</li>
        <li>No connection limits</li>
        <li>Publicly exposed services must be secured by the user</li>
      </ul>

      <h2 id="planned" className="text-xl font-semibold mt-10 mb-4">Planned improvements</h2>
      <Callout type="note">
        The following features are planned but not yet implemented.
      </Callout>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
        <li>TLS encryption on all channels</li>
        <li>Per-data-connection authentication</li>
        <li>Secure tunnel registration</li>
        <li>Rate limiting and connection limits</li>
        <li>Abuse prevention</li>
        <li>Tunnel ownership validation</li>
      </ul>
    </div>
  );
}
