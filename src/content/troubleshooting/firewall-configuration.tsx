import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Firewall Configuration',
  description: 'Configure firewalls for Exposr.',
};

export const headings = [
  { id: 'required-ports', text: 'Required ports', level: 2 },
  { id: 'cloud-providers', text: 'Cloud provider setup', level: 2 },
  { id: 'linux-firewall', text: 'Linux firewall', level: 2 },
];

export default function FirewallConfigurationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="required-ports" className="text-xl font-semibold mt-10 mb-4">Required ports</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse mb-6">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 font-medium text-foreground">Port / Range</th>
              <th className="text-left py-2 pr-4 font-medium text-foreground">Protocol</th>
              <th className="text-left py-2 font-medium text-foreground">Purpose</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">22</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">SSH (if needed for server admin)</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9000</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">Exposr control channel</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">9001</td>
              <td className="py-2 pr-4">TCP</td>
              <td className="py-2">Exposr data channel</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">25565</td>
              <td className="py-2 pr-4">TCP/UDP</td>
              <td className="py-2">Default public tunnel port</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-accent">20000–30000</td>
              <td className="py-2 pr-4">TCP/UDP</td>
              <td className="py-2">Dynamic public tunnel ports</td>
            </tr>
          </tbody>
        </table>
      </div>
      <Callout type="warning">
        Without allowing the 20000–30000 range, Exposr may register a tunnel internally but external users will not be able to reach the exposed service.
      </Callout>

      <h2 id="cloud-providers" className="text-xl font-semibold mt-10 mb-4">Cloud provider setup</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        For Azure, AWS, GCP, or DigitalOcean, you need to configure security groups or network security groups to allow the required ports. In Azure, create inbound security rules for each port/range.
      </p>

      <h2 id="linux-firewall" className="text-xl font-semibold mt-10 mb-4">Linux firewall</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        If using <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">ufw</code>:
      </p>
      <CodeBlock language="bash">{`sudo ufw allow 9000/tcp
sudo ufw allow 9001/tcp
sudo ufw allow 25565/tcp
sudo ufw allow 25565/udp
sudo ufw allow 20000:30000/tcp
sudo ufw allow 20000:30000/udp`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        If using <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">iptables</code>:
      </p>
      <CodeBlock language="bash">{`sudo iptables -A INPUT -p tcp --dport 9000 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 9001 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 25565 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 25565 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 20000:30000 -j ACCEPT
sudo iptables -A INPUT -p udp --dport 20000:30000 -j ACCEPT`}</CodeBlock>
    </div>
  );
}
