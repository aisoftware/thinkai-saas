import { ReactNode } from "react";
import BreadcrumbSimple from "../breadcrumbs/BreadcrumbSimple";
import { cn } from "~/lib/utils";

interface Props {
  title: string;
  menu?: {
    title: string;
    routePath?: string;
  }[];
  buttons?: ReactNode;
  children: ReactNode;
  className?: string;
}
export default function NewPageLayout({ title, menu, buttons, children, className }: Props) {
  return (
    <div className={cn(className, "mx-auto max-w-2xl space-y-3 px-4 pb-6 pt-3 sm:px-6 lg:px-8")}>
      <div className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <h1 className="flex flex-1 items-center truncate text-xl font-medium">{title}</h1>
          <div className="flex items-center space-x-2">{buttons}</div>
        </div>

        {menu && <BreadcrumbSimple menu={menu} />}
      </div>

      {children}
    </div>
  );
}
