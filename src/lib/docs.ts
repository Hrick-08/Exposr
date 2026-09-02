import { DocPage, SearchResult } from "./types";

// Getting Started
import * as introduction from "@/content/getting-started/introduction";
import * as howItWorks from "@/content/getting-started/how-it-works";
import * as installation from "@/content/getting-started/installation";
import * as quickStart from "@/content/getting-started/quick-start";

// CLI
import * as cliOverview from "@/content/cli/overview";
import * as cliExpose from "@/content/cli/expose";
import * as cliConfiguration from "@/content/cli/configuration";
import * as cliServerCommands from "@/content/cli/server-commands";

// Concepts
import * as tunnels from "@/content/concepts/tunnels";
import * as controlConnection from "@/content/concepts/control-connection";
import * as dataConnections from "@/content/concepts/data-connections";
import * as publicPorts from "@/content/concepts/public-ports";
import * as portAssignment from "@/content/concepts/port-assignment";

// Guides
import * as exposeWebApp from "@/content/guides/expose-web-app";
import * as exposeFastapi from "@/content/guides/expose-fastapi";
import * as customPublicPorts from "@/content/guides/custom-public-ports";
import * as ownRelayServer from "@/content/guides/own-relay-server";
import * as multipleClients from "@/content/guides/multiple-clients";
import * as productionServer from "@/content/guides/production-server";

// Architecture
import * as systemOverview from "@/content/architecture/system-overview";
import * as clientArchitecture from "@/content/architecture/client-architecture";
import * as serverArchitecture from "@/content/architecture/server-architecture";
import * as connectionLifecycle from "@/content/architecture/connection-lifecycle";
import * as protocol from "@/content/architecture/protocol";

// Configuration
import * as clientConfiguration from "@/content/configuration/client-configuration";
import * as serverConfiguration from "@/content/configuration/server-configuration";
import * as environmentVariables from "@/content/configuration/environment-variables";

// Security
import * as currentSecurityModel from "@/content/security/current-security-model";
import * as authentication from "@/content/security/authentication";
import * as tlsAndHttps from "@/content/security/tls-and-https";
import * as productionRecommendations from "@/content/security/production-recommendations";

// Troubleshooting
import * as connectionProblems from "@/content/troubleshooting/connection-problems";
import * as portInUse from "@/content/troubleshooting/port-in-use";
import * as tunnelDisconnects from "@/content/troubleshooting/tunnel-disconnects";
import * as firewallConfiguration from "@/content/troubleshooting/firewall-configuration";

// Reference
import * as cliReference from "@/content/reference/cli-reference";
import * as configurationReference from "@/content/reference/configuration-reference";
import * as protocolReference from "@/content/reference/protocol-reference";

interface ContentModule {
  meta: { title: string; description: string };
  headings: { id: string; text: string; level: number }[];
  default: React.ComponentType;
}

const contentMap: Record<string, ContentModule> = {
  // Getting Started
  "getting-started/introduction": introduction,
  "getting-started/how-it-works": howItWorks,
  "getting-started/installation": installation,
  "getting-started/quick-start": quickStart,

  // CLI
  "cli/overview": cliOverview,
  "cli/expose": cliExpose,
  "cli/configuration": cliConfiguration,
  "cli/server-commands": cliServerCommands,

  // Concepts
  "concepts/tunnels": tunnels,
  "concepts/control-connection": controlConnection,
  "concepts/data-connections": dataConnections,
  "concepts/public-ports": publicPorts,
  "concepts/port-assignment": portAssignment,

  // Guides
  "guides/expose-web-app": exposeWebApp,
  "guides/expose-fastapi": exposeFastapi,
  "guides/custom-public-ports": customPublicPorts,
  "guides/own-relay-server": ownRelayServer,
  "guides/multiple-clients": multipleClients,
  "guides/production-server": productionServer,

  // Architecture
  "architecture/system-overview": systemOverview,
  "architecture/client-architecture": clientArchitecture,
  "architecture/server-architecture": serverArchitecture,
  "architecture/connection-lifecycle": connectionLifecycle,
  "architecture/protocol": protocol,

  // Configuration
  "configuration/client-configuration": clientConfiguration,
  "configuration/server-configuration": serverConfiguration,
  "configuration/environment-variables": environmentVariables,

  // Security
  "security/current-security-model": currentSecurityModel,
  "security/authentication": authentication,
  "security/tls-and-https": tlsAndHttps,
  "security/production-recommendations": productionRecommendations,

  // Troubleshooting
  "troubleshooting/connection-problems": connectionProblems,
  "troubleshooting/port-in-use": portInUse,
  "troubleshooting/tunnel-disconnects": tunnelDisconnects,
  "troubleshooting/firewall-configuration": firewallConfiguration,

  // Reference
  "reference/cli-reference": cliReference,
  "reference/configuration-reference": configurationReference,
  "reference/protocol-reference": protocolReference,
};

export function getDocPage(slug: string): DocPage | null {
  const content = contentMap[slug];
  if (!content) return null;

  const parts = slug.split("/");
  return {
    slug,
    title: content.meta.title,
    description: content.meta.description,
    section: parts[0],
    sectionSlug: parts[0],
    headings: content.headings,
    content: content.default,
  };
}

export function getAllDocSlugs(): string[] {
  return Object.keys(contentMap);
}

export function searchDocs(query: string): SearchResult[] {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const [slug, content] of Object.entries(contentMap)) {
    const titleMatch = content.meta.title.toLowerCase().includes(q);
    const descMatch = content.meta.description.toLowerCase().includes(q);
    const headingMatch = content.headings.some((h) =>
      h.text.toLowerCase().includes(q)
    );

    if (titleMatch || descMatch || headingMatch) {
      const parts = slug.split("/");
      results.push({
        title: content.meta.title,
        section: parts[0]
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        slug: `/docs/${slug}`,
        description: content.meta.description,
      });
    }
  }

  return results;
}
