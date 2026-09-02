import { CodeBlock } from '@/components/docs/code-block';

export const meta = {
  title: 'Multiple Clients',
  description: 'Run multiple agents on different machines or ports.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'example', text: 'Example', level: 2 },
];

export default function MultipleClientsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        The Exposr server supports multiple agents simultaneously. Each agent can own a different public port, and the server tracks the owner of each tunnel independently.
      </p>

      <h2 id="example" className="text-xl font-semibold mt-10 mb-4">Example</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Three agents exposing different services:
      </p>
      <CodeBlock language="text">{`Agent A: 127.0.0.1:3000  ->  SERVER_IP:25565
Agent B: 127.0.0.1:8080  ->  SERVER_IP:28061
Agent C: 127.0.0.1:5000  ->  SERVER_IP:29040`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        Each agent maintains its own control connection and handles data tunnels independently.
      </p>
    </div>
  );
}
