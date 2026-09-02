import { DocsHeader } from "@/components/docs/docs-header";
import { DocsSidebar } from "@/components/docs/docs-sidebar";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DocsHeader />
      <div className="flex flex-1 w-full max-w-[90rem] mx-auto">
        <DocsSidebar />
        {children}
      </div>
    </div>
  );
}
