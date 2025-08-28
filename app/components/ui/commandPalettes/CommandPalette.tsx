import { ReactNode } from "react";
import { Action, KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches } from "kbar";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import { useNavigate } from "react-router";
import UserGroupIconFilled from "../icons/UserGroupIconFilled";
import AdminCommandHelper from "~/utils/helpers/commands/AdminCommandHelper";
import AppCommandHelper from "~/utils/helpers/commands/AppCommandHelper";
import DocsCommandHelper from "~/utils/helpers/commands/DocsCommandHelper";
import { useAppData } from "~/utils/data/useAppData";
import { useRootData } from "~/utils/data/useRootData";

interface Props {
  layout?: "app" | "admin" | "docs";
  children: ReactNode;
  actions?: Action[];
}

export default function CommandPalette({ layout, children, actions }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const appData = useAppData();
  const rootData = useRootData();

  if (layout === "app") {
    actions = AppCommandHelper.getCommands({ t, navigate, appData, rootData });
  } else if (layout === "admin") {
    actions = AdminCommandHelper.getCommands({ t, navigate, rootData });
  } else if (layout === "docs") {
    actions = DocsCommandHelper.getCommands({ t, navigate });
  }

  return (
    <KBarProvider
      actions={actions?.map((i) => {
        return {
          ...i,
          icon: <UserGroupIconFilled className="" />,
        };
      })}
    >
      <CommandBar />
      {children}
    </KBarProvider>
  );
}

function CommandBar() {
  return (
    <KBarPortal>
      <KBarPositioner className="text-foreground bg-foreground/80 dark:bg-background/60 z-50 flex items-center p-2">
        <KBarAnimator className="bg-background w-full max-w-lg overflow-hidden rounded-xl">
          <KBarSearch className="bg-background text-foreground flex w-full border-0 p-4 outline-hidden focus:outline-hidden" />
          <RenderResults />
        </KBarAnimator>
      </KBarPositioner>
    </KBarPortal>
  );
}

function RenderResults() {
  const { results } = useMatches();

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) => (
        <>
          {typeof item === "string" ? (
            <div className={clsx("flex w-full cursor-pointer items-center space-x-3 py-4 pl-4 pr-5", active ? "bg-secondary/90" : "")}>
              <div className="text-foreground/80 text-sm font-medium">{item}</div>
            </div>
          ) : (
            <div className={clsx("flex w-full cursor-pointer items-center space-x-3 py-4 pl-4 pr-5", active ? "bg-secondary/90" : "")}>
              {/* {item.icon && <div className="h-10 w-10 p-2">{item.icon}</div>} */}
              <div className="flex w-full items-center justify-between space-x-2">
                <div className="text-foreground/80 text-sm font-medium">{item.name}</div>
                <div className="text-muted-foreground truncate text-xs">{item.subtitle}</div>
              </div>
            </div>
          )}
        </>
      )}
    />
  );
}
