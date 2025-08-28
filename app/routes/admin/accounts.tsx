import { LoaderFunctionArgs, MetaFunction } from "react-router";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import ServerError from "~/components/ui/errors/ServerError";
import SidebarIconsLayout from "~/components/ui/layouts/SidebarIconsLayout";
import UserIcon from "~/components/ui/icons/UserIcon";
import CustomerIcon from "~/components/ui/icons/settings/CustomerIcon";
import CustomerIconFilled from "~/components/ui/icons/settings/CustomerIconFilled";
import CompanyIcon from "~/components/ui/icons/crm/CompanyIcon";
import CompanyIconFilled from "~/components/ui/icons/crm/CompanyIconFilled";
import { LinkIcon, LockIcon } from "lucide-react";
import { useRootData } from "~/utils/data/useRootData";
import { NoSymbolIcon, ServerStackIcon } from "@heroicons/react/24/outline";

type LoaderData = {
  title: string;
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const data: LoaderData = {
    title: "",
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default () => {
  const { t } = useTranslation();
  const { appConfiguration } = useRootData();
  return <Outlet />;
  return (
    <SidebarIconsLayout
      label={{ align: "right" }}
      items={[
        {
          name: t("admin.tenants.title"),
          href: "/admin/accounts",
          exact: true,
          // permission: "admin.accounts.view",
          icon: <CompanyIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <CompanyIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
        {
          name: t("models.user.plural"),
          href: "/admin/accounts/users",
          // permission: "admin.users.view",
          icon: <CustomerIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <CustomerIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
        {
          name: t("app.sidebar.rolesAndPermissions"),
          href: "/admin/accounts/roles-and-permissions",
          // permission: "admin.roles.view",
          icon: <LockIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <LockIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
        {
          name: "Relationships",
          href: "/admin/accounts/relationships",
          // permission: "admin.relationships.view",
          hidden: !appConfiguration.app.features.tenantTypes,
          icon: <LinkIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <LinkIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
        {
          name: "Subscriptions",
          href: "/admin/accounts/subscriptions",
          // permission: "admin.relationships.view",
          hidden: true,
        },
        {
          name: t("models.blacklist.object"),
          href: "/admin/accounts/blacklist",
          // permission: "admin.blacklist.view",
          icon: <NoSymbolIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <NoSymbolIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
        {
          name: t("models.tenantIpAddress.plural"),
          href: "/admin/accounts/ip-addresses",
          // permission: "admin.tenantIpAddress.view",
          icon: <ServerStackIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
          iconSelected: <ServerStackIcon className="text-muted-foreground h-5 w-5 shrink-0" aria-hidden="true" />,
        },
      ]}
    >
      <Outlet />
    </SidebarIconsLayout>
  );
};

export function ErrorBoundary() {
  return <ServerError />;
}
