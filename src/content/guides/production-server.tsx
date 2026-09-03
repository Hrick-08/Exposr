import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Running the Server in Production',
  description: 'Best practices for running an Exposr relay server.',
};

export const headings = [
  { id: 'current-status', text: 'Current status', level: 2 },
  { id: 'systemd', text: 'Running with systemd', level: 2 },
  { id: 'recommendations', text: 'Recommendations', level: 2 },
];

export default function ProductionServerPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <Callout type="caution">
        Exposr v0.5 is experimental and not production-ready. Use it for development and testing only. See the Security section for current limitations.
      </Callout>

      <h2 id="current-status" className="text-xl font-semibold mt-10 mb-4">Current status</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The server can be started manually with <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr server start</code>. For persistent operation, you can use a process manager.
      </p>

      <h2 id="systemd" className="text-xl font-semibold mt-10 mb-4">Running with systemd</h2>
      <Callout type="experimental">
        Persistent server operation using systemd is a planned feature. The following is a manual setup approach.
      </Callout>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        You can create a systemd service file to keep the server running:
      </p>
      <CodeBlock language="text" filename="/etc/systemd/system/exposr.service">{`[Unit]
Description=Exposr Relay Server
After=network.target

[Service]
Type=simple
User=exposr
ExecStart=/usr/local/bin/exposr server start
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target`}</CodeBlock>
      <CodeBlock language="bash">{`sudo systemctl enable exposr
sudo systemctl start exposr`}</CodeBlock>

      <h2 id="recommendations" className="text-xl font-semibold mt-10 mb-4">Recommendations</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Run the server as a dedicated non-root user</li>
        <li>Configure firewall rules to limit exposure</li>
        <li>Monitor logs for unexpected connection patterns</li>
        <li>Keep Exposr updated with the latest version</li>
        <li>Use the agent token authentication to prevent unauthorized access</li>
      </ul>
    </div>
  );
}
