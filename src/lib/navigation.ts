import { NavSection } from "./types";

export const navigation: NavSection[] = [
  {
    title: "Getting Started",
    slug: "getting-started",
    items: [
      { title: "Introduction", slug: "introduction" },
      { title: "How Exposr Works", slug: "how-it-works" },
      { title: "Installation", slug: "installation" },
      { title: "Quick Start", slug: "quick-start" },
    ],
  },
  {
    title: "CLI",
    slug: "cli",
    items: [
      { title: "Overview", slug: "overview" },
      { title: "expose", slug: "expose" },
      { title: "Configuration", slug: "configuration" },
      { title: "Server Commands", slug: "server-commands" },
    ],
  },
  {
    title: "Concepts",
    slug: "concepts",
    items: [
      { title: "Tunnels", slug: "tunnels" },
      { title: "Control Connection", slug: "control-connection" },
      { title: "Data Connections", slug: "data-connections" },
      { title: "Public Ports", slug: "public-ports" },
      { title: "Port Assignment", slug: "port-assignment" },
    ],
  },
  {
    title: "Guides",
    slug: "guides",
    items: [
      { title: "Expose a Local Web App", slug: "expose-web-app" },
      { title: "Expose a FastAPI App", slug: "expose-fastapi" },
      { title: "Custom Public Ports", slug: "custom-public-ports" },
      { title: "Using Your Own Relay Server", slug: "own-relay-server" },
      { title: "Multiple Clients", slug: "multiple-clients" },
      { title: "Running the Server in Production", slug: "production-server" },
    ],
  },
  {
    title: "Architecture",
    slug: "architecture",
    items: [
      { title: "System Overview", slug: "system-overview" },
      { title: "Client Architecture", slug: "client-architecture" },
      { title: "Server Architecture", slug: "server-architecture" },
      { title: "Connection Lifecycle", slug: "connection-lifecycle" },
      { title: "Protocol", slug: "protocol" },
    ],
  },
  {
    title: "Configuration",
    slug: "configuration",
    items: [
      { title: "Client Configuration", slug: "client-configuration" },
      { title: "Server Configuration", slug: "server-configuration" },
      { title: "Environment Variables", slug: "environment-variables" },
    ],
  },
  {
    title: "Security",
    slug: "security",
    items: [
      { title: "Current Security Model", slug: "current-security-model" },
      { title: "Authentication", slug: "authentication" },
      { title: "TLS and HTTPS", slug: "tls-and-https", badge: "Coming Soon" },
      { title: "Production Recommendations", slug: "production-recommendations" },
    ],
  },
  {
    title: "Troubleshooting",
    slug: "troubleshooting",
    items: [
      { title: "Connection Problems", slug: "connection-problems" },
      { title: "Port Already in Use", slug: "port-in-use" },
      { title: "Tunnel Disconnects", slug: "tunnel-disconnects" },
      { title: "Firewall Configuration", slug: "firewall-configuration" },
    ],
  },
  {
    title: "Reference",
    slug: "reference",
    items: [
      { title: "CLI Reference", slug: "cli-reference" },
      { title: "Configuration Reference", slug: "configuration-reference" },
      { title: "Protocol Reference", slug: "protocol-reference" },
    ],
  },
];

export function getAllSlugs(): string[] {
  const slugs: string[] = [""];
  for (const section of navigation) {
    for (const item of section.items) {
      slugs.push(`${section.slug}/${item.slug}`);
    }
  }
  return slugs;
}

export function getAdjacentPages(currentSlug: string): {
  prev: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
} {
  const allPages: { title: string; slug: string }[] = [];
  for (const section of navigation) {
    for (const item of section.items) {
      allPages.push({
        title: item.title,
        slug: `${section.slug}/${item.slug}`,
      });
    }
  }

  const index = allPages.findIndex((p) => p.slug === currentSlug);
  return {
    prev: index > 0 ? allPages[index - 1] : null,
    next: index < allPages.length - 1 ? allPages[index + 1] : null,
  };
}
