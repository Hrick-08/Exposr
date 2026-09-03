import { Callout } from '@/components/docs/callout';

export const meta = {
  title: 'Production Recommendations',
  description: 'Security recommendations for running Exposr.',
};

export const headings = [
  { id: 'overview', text: 'Overview', level: 2 },
  { id: 'recommendations', text: 'Recommendations', level: 2 },
];

export default function ProductionRecommendationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{meta.title}</h1>
      <p className="text-muted-foreground text-lg mb-8">{meta.description}</p>

      <Callout type="caution">
        Exposr v0.5 is not production-ready. Use it for development and testing only.
      </Callout>

      <h2 id="overview" className="text-xl font-semibold mt-10 mb-4">Overview</h2>
      <p className="text-muted-foreground mb-4 leading-relaxed">
        While Exposr is experimental, the following practices can reduce risk if you choose to use it:
      </p>

      <h2 id="recommendations" className="text-xl font-semibold mt-10 mb-4">Recommendations</h2>
      <ul className="list-disc list-inside space-y-3 text-muted-foreground">
        <li>Run the relay server as a dedicated non-root user</li>
        <li>Restrict firewall rules to only the necessary port ranges</li>
        <li>Always use agent token authentication</li>
        <li>Do not expose services that handle sensitive data without their own encryption</li>
        <li>Monitor server logs for unexpected connections</li>
        <li>Use private relay servers rather than shared instances</li>
        <li>Keep Exposr updated to the latest version</li>
        <li>Consider running the tunneled application itself with HTTPS if it handles sensitive data</li>
        <li>Do not expose administrative interfaces or databases</li>
      </ul>
    </div>
  );
}
