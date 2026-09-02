import { redirect } from "next/navigation";
import { getDocPage, getAllDocSlugs } from "@/lib/docs";
import { getAdjacentPages } from "@/lib/navigation";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { Pagination } from "@/components/docs/pagination";
import type { Metadata } from "next";

export function generateStaticParams() {
  const slugs = getAllDocSlugs();
  return [
    { slug: [] },
    ...slugs.map((s) => ({ slug: s.split("/") })),
  ];
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const slugStr = slug?.join("/") || "getting-started/introduction";
  const page = getDocPage(slugStr);
  if (!page) return { title: "Not Found" };
  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DocsPage(props: PageProps<"/docs/[[...slug]]">) {
  const { slug } = await props.params;
  const slugStr = slug?.join("/") || "";

  // Root /docs -> redirect to introduction
  if (!slugStr) {
    redirect("/docs/getting-started/introduction");
  }

  const page = getDocPage(slugStr);
  if (!page) {
    redirect("/docs/getting-started/introduction");
  }

  const { prev, next } = getAdjacentPages(slugStr);
  const Content = page.content;

  return (
    <>
      <main className="flex-1 min-w-0 px-6 lg:px-10 py-8 pb-16">
        <div className="max-w-3xl">
          <Content />
          <Pagination prev={prev} next={next} />

          {/* Edit on GitHub link */}
          <div className="mt-8 pt-4 border-t border-border">
            <a
              href={`https://github.com/Hrick-08/Exposr`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-accent transition-colors"
            >
              Edit this page on GitHub &rarr;
            </a>
          </div>
        </div>
      </main>
      <TableOfContents headings={page.headings} />
    </>
  );
}
