import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Tunnel Disconnects',
  description: 'Troubleshoot unexpected tunnel disconnections.',
};

export const headings = [
  { id: 'causes', text: 'Common causes', level: 2 },
  { id: 'reconnection', text: 'Automatic reconnection', level: 2 },
  { id: 'stability', text: 'Improving stability', level: 2 },
];

export default function TunnelDisconnectsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="causes" className="text-xl font-semibold mt-10 mb-4">Common causes</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
        <li><strong className="text-foreground">Network instability</strong> — The TCP connection between agent and server can drop due to network issues.</li>
        <li><strong className="text-foreground">Server restart</strong> — If the relay server restarts, all tunnels are lost.</li>
        <li><strong className="text-foreground">Idle timeout</strong> — Some networks or firewalls close idle TCP connections.</li>
        <li><strong className="text-foreground">Resource exhaustion</strong> — The server may run out of file descriptors or memory under high load.</li>
      </ul>

      <h2 id="reconnection" className="text-xl font-semibold mt-10 mb-4">Automatic reconnection</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr includes automatic reconnection. If the control connection drops, the agent attempts to reconnect and re-register its public port.
      </p>

      <h2 id="stability" className="text-xl font-semibold mt-10 mb-4">Improving stability</h2>
      <ul className="list-disc list-inside space-y-2 text-muted-foreground">
        <li>Use a stable internet connection on both the client and server</li>
        <li>Run the relay server on a reliable VPS or cloud VM</li>
        <li>Monitor the server process and restart it automatically (e.g., with systemd)</li>
        <li>Keep Exposr updated</li>
      </ul>
      <Callout type="note">
        Agent heartbeat and stale-agent detection are planned features that will improve tunnel reliability.
      </Callout>
    </div>
  );
}
