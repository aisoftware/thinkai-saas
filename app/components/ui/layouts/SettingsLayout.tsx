import { Link, useLocation } from "react-router";
import clsx from "clsx";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import Tabs from "../tabs/Tabs";

export default function SettingsLayout({
  items,
  children,
}: {
  items: { name: string; description: string; routePath: string; icon: ReactNode }[];
  children: ReactNode;
}) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto lg:overflow-hidden">
        {/* Breadcrumb */}
        <div className="p-3 lg:hidden">
          <Tabs tabs={items} breakpoint="lg" asLinks={true} />
        </div>

        <div className="flex flex-1 lg:overflow-hidden">
          {/* Secondary sidebar */}
          <nav aria-label="Sections" className="border-border bg-background hidden w-72 shrink-0 border-r lg:flex lg:flex-col">
            <div className="border-border flex h-16 shrink-0 items-center border-b px-6">
              <p className="text-foreground text-lg font-medium">{t("settings.title")}</p>
            </div>
            <div className="min-h-screen flex-1 overflow-y-auto">
              <SubNavigation items={items} />
            </div>
          </nav>

          {children}
        </div>
      </div>
    </div>
  );
}

function SubNavigation({
  items,
}: {
  items: {
    name: string;
    description: string;
    routePath: string;
    icon: ReactNode;
  }[];
}) {
  const location = useLocation();
  function isCurrent(idx: number) {
    return currentTab() === items[idx];
  }
  const currentTab = () => {
    return items.find((element) => element.routePath && (location.pathname + location.search).includes(element.routePath));
  };

  return (
    <>
      {items.map((item, idx) => (
        <Link
          key={item.name}
          to={item.routePath}
          className={clsx(isCurrent(idx) ? "bg-secondary/50" : "hover:bg-secondary/50", "border-border flex border-b px-6 py-3")}
          aria-current={isCurrent(idx) ? "page" : undefined}
        >
          {item.icon}
          <div className="ml-3 text-sm">
            <p className="text-foreground font-medium">{item.name}</p>
            <p className="text-muted-foreground mt-1 text-xs">{item.description}</p>
          </div>
        </Link>
      ))}
    </>
  );
}
