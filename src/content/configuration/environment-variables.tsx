import { Callout } from '@/components/docs/callout';
import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Environment Variables',
  description: 'Environment variable configuration for Exposr.',
};

export const headings = [
  { id: 'current-support', text: 'Current support', level: 2 },
  { id: 'planned', text: 'Planned environment variables', level: 2 },
];

export default function EnvironmentVariablesPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="current-support" className="text-xl font-semibold mt-10 mb-4">Current support</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Exposr v0.4 primarily uses file-based configuration (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code>) and CLI flags. Environment variable support is minimal in the current version.
      </p>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Configuration is managed through:
      </p>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/config.json</code> — Server address and settings</li>
        <li><code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">~/.exposr/agent_token.txt</code> — Agent authentication token</li>
        <li>CLI flags (<code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">--server-host</code>, etc.) — Per-run overrides</li>
      </ul>

      <h2 id="planned" className="text-xl font-semibold mt-10 mb-4">Planned environment variables</h2>
      <Callout type="experimental">
        Environment variable configuration is a planned feature. The following variables are not yet implemented.
      </Callout>
      <CodeBlock language="bash">{`# Planned (not yet implemented)
EXPOSR_SERVER_HOST=20.198.81.254
EXPOSR_CONTROL_PORT=9000
EXPOSR_DATA_PORT=9001
EXPOSR_AGENT_TOKEN=your-token-here`}</CodeBlock>
    </div>
  );
}
