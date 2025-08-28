import { ReactNode } from "react";
import Breadcrumb from "../breadcrumbs/Breadcrumb";
import Tabs, { TabItem } from "../tabs/Tabs";
import BreadcrumbSimple from "../breadcrumbs/BreadcrumbSimple";

interface Props {
  title?: ReactNode;
  buttons?: ReactNode;
  children: ReactNode;
  tabs?: TabItem[];
  breadcrumb?: { title: string; routePath?: string }[];
  replaceTitleWithTabs?: boolean;
}
export default function IndexPageLayout({ title, buttons, children, tabs, breadcrumb, replaceTitleWithTabs }: Props) {
  return (
    <>
      {(title || buttons || (replaceTitleWithTabs && tabs)) && (
        <div className="border-border bg-background w-full border-b py-2 shadow-2xs">
          <div className="mx-auto flex max-w-5xl items-center justify-between space-x-2 px-4 sm:px-6 lg:px-8 xl:max-w-full">
            {replaceTitleWithTabs && tabs ? (
              <Tabs tabs={tabs} exact className="grow" />
            ) : (
              <div className="flex flex-1 items-center truncate font-bold">{title}</div>
            )}
            {buttons && <div className="flex items-center space-x-2">{buttons}</div>}
          </div>
        </div>
      )}
      {breadcrumb && <BreadcrumbSimple className="p-4" menu={breadcrumb} />}
      {tabs && !replaceTitleWithTabs && (
        <div className="w-full py-2">
          <div className="mx-auto flex max-w-5xl items-center justify-between space-x-2 px-4 sm:px-6 lg:px-8 xl:max-w-full">
            <Tabs tabs={tabs} className="grow" />
          </div>
        </div>
      )}
      <div className="mx-auto max-w-5xl space-y-2 px-4 pb-6 pt-2 sm:px-6 lg:px-8 xl:max-w-full">{children}</div>
    </>
  );
}
