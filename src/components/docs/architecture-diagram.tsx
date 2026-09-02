export function ArchitectureDiagram() {
  return (
    <div className="my-8 flex justify-center">
      <div className="relative w-full max-w-md">
        {/* Internet User */}
        <div className="flex justify-center">
          <div className="rounded-lg border border-border bg-surface px-6 py-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Internet User</p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-6 bg-border" />
            <div className="text-accent text-xs font-mono">▼</div>
          </div>
        </div>

        {/* Public Address */}
        <div className="flex justify-center">
          <div className="rounded-md border border-accent/30 bg-accent-muted px-4 py-1.5">
            <p className="text-xs font-mono text-accent">SERVER_IP:PUBLIC_PORT</p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-6 bg-border" />
            <div className="text-accent text-xs font-mono">▼</div>
          </div>
        </div>

        {/* Exposr Server */}
        <div className="flex justify-center">
          <div className="rounded-lg border border-accent/30 bg-surface w-full max-w-xs">
            <div className="px-5 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Exposr Server</p>
            </div>
            <div className="px-5 py-3 space-y-1">
              <p className="text-xs font-mono text-muted-foreground">Control Port: <span className="text-accent">9000</span></p>
              <p className="text-xs font-mono text-muted-foreground">Data Port: <span className="text-accent">9001</span></p>
              <p className="text-xs font-mono text-muted-foreground">Public Ports: <span className="text-accent">25565</span>, <span className="text-accent">20000–30000</span></p>
            </div>
          </div>
        </div>

        {/* Arrow down with label */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-4 bg-border" />
            <p className="text-[10px] text-muted-foreground my-0.5">Persistent outbound connection</p>
            <div className="w-px h-4 bg-border" />
            <div className="text-accent text-xs font-mono">▼</div>
          </div>
        </div>

        {/* Exposr Client */}
        <div className="flex justify-center">
          <div className="rounded-lg border border-border bg-surface px-6 py-3 text-center">
            <p className="text-sm font-semibold text-foreground">Exposr Client</p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-6 bg-border" />
            <div className="text-accent text-xs font-mono">▼</div>
          </div>
        </div>

        {/* Local Address */}
        <div className="flex justify-center">
          <div className="rounded-md border border-accent/30 bg-accent-muted px-4 py-1.5">
            <p className="text-xs font-mono text-accent">127.0.0.1:LOCAL_PORT</p>
          </div>
        </div>

        {/* Arrow down */}
        <div className="flex justify-center my-1">
          <div className="flex flex-col items-center">
            <div className="w-px h-6 bg-border" />
            <div className="text-accent text-xs font-mono">▼</div>
          </div>
        </div>

        {/* Local Service */}
        <div className="flex justify-center">
          <div className="rounded-lg border border-border bg-surface px-6 py-3 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Local Service</p>
          </div>
        </div>
      </div>
    </div>
  );
}
