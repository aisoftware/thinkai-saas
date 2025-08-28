import { Link, useParams } from "react-router";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import UrlUtils from "~/utils/app/UrlUtils";

interface MenuItem {
  title: string;
  routePath?: string;
}

interface Props {
  menu: MenuItem[];
  className?: string;
  home?: string;
}

export default function Breadcrumb({ className = "", home = "", menu = [] }: Props) {
  const params = useParams();
  const { t } = useTranslation();
  function getHomeItem() {
    if (params.tenant) {
      return UrlUtils.currentTenantUrl(params, "dashboard");
    } else {
      return "/admin/dashboard";
    }
  }
  return (
    <nav className={clsx(className, "border-border bg-background flex overflow-x-auto border-b")} aria-label="Breadcrumb">
      <ol className="flex w-full max-w-(--breakpoint-xl) space-x-4 px-4 sm:px-6 lg:px-8">
        <li className="flex">
          <div className="flex items-center">
            <Link to={home.length > 0 ? home : getHomeItem()} className="hover:text-muted-foreground text-muted-foreground">
              {/*Heroicon name: solid/home */}
              <svg className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              <span className="sr-only">{t("shared.home")}</span>
            </Link>
          </div>
        </li>
        {menu.map((item, idx) => {
          return (
            <li key={idx} className="flex">
              <div className="flex items-center">
                <svg
                  className="h-full w-5 shrink-0 text-gray-200 sm:w-6"
                  viewBox="0 0 24 44"
                  preserveAspectRatio="none"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                </svg>

                {(() => {
                  if (!item.routePath) {
                    return (
                      <div className="text-muted-foreground hover:text-foreground/80 ml-2 select-none truncate font-medium sm:ml-4 sm:text-sm">
                        {item.title}
                      </div>
                    );
                  } else {
                    return (
                      <Link to={item.routePath} className="text-muted-foreground hover:text-foreground/80 ml-2 truncate font-medium sm:ml-4 sm:text-sm">
                        {item.title}
                      </Link>
                    );
                  }
                })()}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
