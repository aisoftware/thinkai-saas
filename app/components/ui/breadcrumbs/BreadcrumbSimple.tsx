import clsx from "clsx";
import { Link } from "react-router";
import RightIcon from "../icons/RightIcon";

interface MenuItem {
  title: string;
  routePath?: string;
}

interface Props {
  menu: MenuItem[];
  className?: string;
  home?: string;
}

export default function BreadcrumbSimple({ menu = [], className = "", home = "" }: Props) {
  return (
    <nav className={clsx("not-prose flex truncate", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        {home && (
          <li>
            <div>
              <Link to={home.length > 0 ? home : "/"} className="hover:text-muted-foreground text-gray-300">
                <svg className="h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="sr-only">Home</span>
              </Link>
            </div>
          </li>
        )}
        {menu
          .filter((f) => f.title)
          .map((item, idx) => (
            <li key={item.title}>
              <div className="flex items-center">
                {(idx > 0 || home) && <RightIcon className="text-muted-foreground h-4 w-4 shrink-0" />}
                {item.routePath ? (
                  <Link
                    to={item.routePath}
                    className={clsx("hover:text-muted-foreground text-muted-foreground select-none text-sm font-normal", home && "ml-1")}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <span className="text-muted-foreground ml-1 select-none text-sm font-normal">{item.title}</span>
                )}
              </div>
            </li>
          ))}
      </ol>
    </nav>
  );
}
