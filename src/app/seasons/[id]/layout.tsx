import SeasonNavigation from "@/components/season-navigation";
import { SiteHeader } from "@/components/site-header";

export default function SeasonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader maxWidth="max-w-5xl">
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <SeasonNavigation />
        </div>
      </SiteHeader>
      {children}
    </main>
  );
}
