import { Link, LoaderFunctionArgs, redirect, useOutlet } from "react-router";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import IconAnalytics from "~/components/layouts/icons/IconAnalytics";
import IconKeys from "~/components/layouts/icons/IconKeys";
import CacheIcon from "~/components/ui/icons/CacheIcon";
import CookieIcon from "~/components/ui/icons/CookieIcon";
import CurrencyIcon from "~/components/ui/icons/CurrencyIcon";
import EmailIcon from "~/components/ui/icons/EmailIcon";
import ExclamationTriangleIcon from "~/components/ui/icons/ExclamationTriangleIcon";
import GearIcon from "~/components/ui/icons/GearIcon";
import GearIconFilled from "~/components/ui/icons/GearIconFilled";
import LanguageIcon from "~/components/ui/icons/LanguageIcon";
import MagnifyingGlassIcon from "~/components/ui/icons/MagnifyingGlassIcon";
import UserIcon from "~/components/ui/icons/UserIcon";
import MembershipCardIcon from "~/components/ui/icons/settings/MembershipCardIcon";
import MembershipCardIconFilled from "~/components/ui/icons/settings/MembershipCardIconFilled";
import SidebarIconsLayout from "~/components/ui/layouts/SidebarIconsLayout";
import UrlUtils from "~/utils/app/UrlUtils";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  return Response.json({ title: t("app.sidebar.settings") });
};

export default function AdminSettings() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();

  if (outlet) {
    return outlet;
  }

  const items = [
    {
      name: t("settings.admin.profile.title"),
      description: t("settings.admin.profile.description"),
      href: "/admin/settings/profile",
      icon: <UserIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <UserIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.general.title"),
      description: t("settings.admin.general.description"),
      href: "/admin/settings/general",
      icon: <GearIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <GearIconFilled className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.pricing.title"),
      description: t("settings.admin.pricing.description"),
      href: "/admin/settings/pricing",
      icon: <CurrencyIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CurrencyIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.authentication.title"),
      description: t("settings.admin.authentication.description"),
      href: "/admin/settings/authentication",
      icon: <IconKeys className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <IconKeys className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.analytics.title"),
      description: t("settings.admin.analytics.description"),
      href: "/admin/settings/analytics",
      icon: <IconAnalytics className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <IconAnalytics className="size-5 shrink-0" aria-hidden="true" />,
    },
    // {
    //   name: t("settings.admin.seo.title"),
    // description: t("settings.admin.seo.description"),
    //   href: "/admin/settings/seo",
    //   icon: <MagnifyingGlassIcon className=" size-5 shrink-0" aria-hidden="true" />,
    //   iconSelected: <MagnifyingGlassIcon className=" size-5 shrink-0" aria-hidden="true" />,
    // },
    // {
    //   name: t("settings.admin.internationalization.title"),
    // description: t("settings.admin.internationalization.description"),
    //   href: "/admin/settings/internationalization",
    //   icon: <LanguageIcon className="size-5 shrink-0" aria-hidden="true" />,
    //   iconSelected: <LanguageIcon className="size-5 shrink-0" aria-hidden="true" />,
    // },
    {
      name: t("settings.admin.transactionalEmails.title"),
      description: t("settings.admin.transactionalEmails.description"),
      href: "/admin/settings/transactional-emails",
      icon: <EmailIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <EmailIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.tenants.types.title"),
      description: t("settings.admin.tenants.types.description"),
      href: "/admin/settings/accounts/types",
      icon: <MembershipCardIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <MembershipCardIconFilled className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.cookies.title"),
      description: t("settings.admin.cookies.description"),
      href: "/admin/settings/cookies",
      icon: <CookieIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CookieIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.cache.title"),
      description: t("settings.admin.cache.description"),
      href: "/admin/settings/cache",
      icon: <CacheIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <CacheIcon className="size-5 shrink-0" aria-hidden="true" />,
    },
    {
      name: t("settings.admin.danger.title"),
      description: t("settings.admin.danger.description"),
      href: "/admin/settings/danger",
      icon: <ExclamationTriangleIcon className="size-5 shrink-0" aria-hidden="true" />,
      iconSelected: <ExclamationTriangleIcon className="size-5 shrink-0" aria-hidden="true" />,
      bottom: true,
    },
  ];
  return (
    <EditPageLayout title="Settings">
      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <Card key={item.href} className="bg-card hover:bg-secondary relative p-4">
            <CardTitle className="flex items-center gap-2">
              {item.icon}
              <Link to={item.href} className="font-medium">
                <span className="absolute inset-0" />
                {item.name}
              </Link>
            </CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </Card>
        ))}
      </div>
    </EditPageLayout>
  );
}
