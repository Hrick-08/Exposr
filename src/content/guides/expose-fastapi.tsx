import { CodeBlock } from '@/components/docs/code-block';
import { Terminal } from '@/components/docs/terminal';

export const meta = {
  title: 'Expose a FastAPI App',
  description: 'Expose a local FastAPI application through an Exposr tunnel.',
};

export const headings = [
  { id: 'setup', text: 'Setup', level: 2 },
  { id: 'start-fastapi', text: 'Start FastAPI', level: 2 },
  { id: 'expose', text: 'Expose it', level: 2 },
  { id: 'access-docs', text: 'Access Swagger docs', level: 2 },
];

export default function ExposeFastAPIPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <h2 id="setup" className="text-xl font-semibold mt-10 mb-4">Setup</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        Create a basic FastAPI application:
      </p>
      <CodeBlock language="python" filename="main.py">{`from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Hello from Exposr!"}`}</CodeBlock>

      <h2 id="start-fastapi" className="text-xl font-semibold mt-10 mb-4">Start FastAPI</h2>
      <CodeBlock language="bash">{`uvicorn main:app --host 127.0.0.1 --port 3000`}</CodeBlock>

      <h2 id="expose" className="text-xl font-semibold mt-10 mb-4">Expose it</h2>
      <CodeBlock language="bash">{`exposr expose 3000`}</CodeBlock>

      <h2 id="access-docs" className="text-xl font-semibold mt-10 mb-4">Access Swagger docs</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        With the tunnel active, FastAPI&apos;s built-in Swagger documentation is accessible at:
      </p>
      <CodeBlock language="text">{`http://SERVER_IP:25565/docs`}</CodeBlock>
      <p className="text-muted-foreground mt-4 leading-relaxed">
        The interactive API documentation works through the tunnel just as it does locally.
      </p>
    </div>
  );
}
