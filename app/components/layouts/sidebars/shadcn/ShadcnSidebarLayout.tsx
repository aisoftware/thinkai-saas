import { SidebarInset, SidebarProvider, SidebarTrigger } from "../../../ui/sidebar";
import { ShadcnAppSidebar } from "./app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "~/components/ui/breadcrumb";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { useParams } from "react-router";
import { useTitleData } from "~/utils/data/useTitleData";
import { useRef, useState } from "react";
import { NavActions } from "./nav-actions";
import { useKBar } from "kbar";
import OnboardingSession from "~/modules/onboarding/components/OnboardingSession";
import { Separator } from "~/components/ui/separator";

export default function ShadcnSidebarLayout({
  children,
  layout,
  menuItems,
}: {
  children: React.ReactNode;
  layout: "app" | "admin" | "docs";
  menuItems?: SideBarItem[];
}) {
  const params = useParams();
  const title = useTitleData() ?? "";

  const mainElement = useRef<HTMLElement>(null);

  const { query } = useKBar();

  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  function onOpenCommandPalette() {
    query.toggle();
  }
  return (
    <SidebarProvider>
      <OnboardingSession open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />
      <ShadcnAppSidebar layout={layout} items={menuItems} />
      <SidebarInset className="overflow-hidden">
        <header className="border-border flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 truncate px-4">
            <SidebarTrigger className="-ml-1" />
            {title && <Separator orientation="vertical" className="mr-2 h-4" />}
            <Breadcrumb className="truncate">
              <BreadcrumbList className="truncate">
                <BreadcrumbItem className="block truncate">
                  <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
                </BreadcrumbItem>
                {/* <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem> */}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto px-3">
            <NavActions layout={layout} onOpenCommandPalette={onOpenCommandPalette} setOnboardingModalOpen={setOnboardingModalOpen} />
          </div>
        </header>
        <main ref={mainElement} className="flex-1 focus:outline-hidden" tabIndex={0}>
          <div key={params.tenant} className="pb-20 sm:pb-0">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
