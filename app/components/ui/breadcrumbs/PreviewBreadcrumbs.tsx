import { useLocation } from "react-router";
import Breadcrumb from "./Breadcrumb";
import BreadcrumbSimple from "./BreadcrumbSimple";

export default function PreviewBreadcrumbs() {
  const currentRoute = useLocation().pathname;
  return (
    <div id="breadcrumbs" className="not-prose w-full">
      <h3 className="text-sm font-medium">Breadcrumb</h3>
      <div className="border-border flex items-center space-x-2 border border-dashed p-2">
        <Breadcrumb
          className="w-full"
          home="/"
          menu={[
            { title: "Docs", routePath: "/docs" },
            { title: "Components", routePath: "/docs/components" },
            { title: "Breadcrumbs", routePath: currentRoute },
          ]}
        />
      </div>

      <h3 className="text-sm font-medium">BreadcrumbSimple</h3>
      <div className="border-border bg-background border border-dashed p-6">
        <BreadcrumbSimple
          className="not-prose w-full"
          home="/"
          menu={[
            { title: "Docs", routePath: "/docs" },
            { title: "Components", routePath: "/docs/components" },
            { title: "Breadcrumbs", routePath: currentRoute },
          ]}
        />
      </div>
    </div>
  );
}
