import { CodeBlock } from '@/components/docs/code-block';
import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Installation',
  description: 'Install the Exposr CLI on your machine.',
};

export const headings = [
  { id: 'requirements', text: 'Requirements', level: 2 },
  { id: 'install-from-source', text: 'Install from source', level: 2 },
  { id: 'development-install', text: 'Development installation', level: 2 },
  { id: 'windows-path', text: 'Windows PATH setup', level: 2 },
  { id: 'verify', text: 'Verify installation', level: 2 },
];

export default function InstallationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="requirements" className="text-xl font-semibold mt-10 mb-4">Requirements</h2>
      <ul className="list-disc list-inside space-y-1 text-muted-foreground mb-6">
        <li>Python 3.10 or later</li>
        <li>pip (Python package manager)</li>
        <li>An internet connection</li>
        <li>A local TCP or UDP service to expose</li>
      </ul>

      <h2 id="install-from-source" className="text-xl font-semibold mt-10 mb-4">Install from source</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Clone the repository and install the package:
      </p>
      <CodeBlock language="bash">{`git clone https://github.com/Hrick-08/Exposr.git
cd Exposr
python -m pip install .`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        This installs the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr</code> command globally via the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">client.main:main</code> entry point.
      </p>

      <h2 id="development-install" className="text-xl font-semibold mt-10 mb-4">Development installation</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        For development, use an editable installation so source changes take effect immediately:
      </p>
      <CodeBlock language="bash">{`python -m pip install -e .`}</CodeBlock>

      <h2 id="windows-path" className="text-xl font-semibold mt-10 mb-4">Windows PATH setup</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        On Windows, the <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr</code> executable may be installed in a directory not on your PATH. If you see:
      </p>
      <CodeBlock language="text">{`'exposr' is not recognized as an internal or external command`}</CodeBlock>
      <p className="text-muted-foreground mt-4 mb-4 leading-relaxed">
        Find your Python user base directory and add its <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">Scripts</code> folder to PATH:
      </p>
      <CodeBlock language="bash">{`python -m site --user-base
# Add the Scripts directory inside that location to PATH

# Verify
where exposr`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        After updating PATH, open a new terminal window.
      </p>

      <h2 id="verify" className="text-xl font-semibold mt-10 mb-4">Verify installation</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Run the following to verify Exposr is installed:
      </p>
      <CodeBlock language="bash">{`exposr tcp 3000 25565`}</CodeBlock>
        <CodeBlock language="bash">{`exposr tcp 3000 25565`}</CodeBlock>
      <Callout type="note">
        If you haven&apos;t configured a server yet, Exposr will show an error asking you to run <code className="text-sm bg-code-bg px-1.5 py-0.5 rounded font-mono text-accent">exposr config set-server &lt;server-ip&gt;</code>. This is expected — see the Quick Start guide.
      </Callout>
    </div>
  );
}
