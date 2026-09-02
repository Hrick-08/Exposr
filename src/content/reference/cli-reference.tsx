import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'CLI Reference',
  description: 'Complete reference for the Exposr CLI.',
};

export const headings = [
  { id: 'expose', text: 'exposr expose', level: 2 },
  { id: 'config', text: 'exposr config', level: 2 },
  { id: 'server', text: 'exposr server', level: 2 },
];

export default function CLIReferencePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="expose" className="text-xl font-semibold mt-10 mb-4 font-mono">exposr expose</h2>
      <CodeBlock language="text">{`exposr expose <local-port> [to <public-port>] [options]

Arguments:
  <local-port>              Local port to forward traffic to (required)
  to <public-port>          Specific public port to request (optional)

Options:
  --server-host <ip>        Override the relay server address
  --control-port <port>     Control channel port (default: 9000)
  --data-port <port>        Data channel port (default: 9001)
  --local-host <host>       Local host to forward to (default: 127.0.0.1)

Examples:
  exposr expose 3000
  exposr expose 3000 to 21342
  exposr expose 8080 --server-host 10.0.0.5`}</CodeBlock>

      <h2 id="config" className="text-xl font-semibold mt-10 mb-4 font-mono">exposr config</h2>
      <CodeBlock language="text">{`exposr config set-server <server-ip>

Saves the relay server address to ~/.exposr/config.json
and generates a random agent token in ~/.exposr/agent_token.txt

Examples:
  exposr config set-server 20.198.81.254`}</CodeBlock>

      <h2 id="server" className="text-xl font-semibold mt-10 mb-4 font-mono">exposr server</h2>
      <CodeBlock language="text">{`exposr server init-token <token>
  Initialize the server with an agent authentication token.
  Writes to ~/.exposr/config.json

exposr server start
  Start the relay server.
  Listens on ports 9000 (control) and 9001 (data).
  The server must be initialized with init-token first.

Examples:
  exposr server init-token abc123def456
  exposr server start`}</CodeBlock>
    </div>
  );
}
