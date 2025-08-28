import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useSearchParams } from "react-router";
import { useAppData } from "~/utils/data/useAppData";
import { DashboardLoaderData, loadDashboardData } from "~/utils/data/useDashboardData";
import { getTranslations } from "~/locale/i18next.server";
import { getAppDashboardStats } from "~/utils/services/appDashboardService";
import ProfileBanner from "~/components/app/ProfileBanner";
import { DashboardStats } from "~/components/ui/stats/DashboardStats";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { Stat } from "~/application/dtos/stats/Stat";
import InputSelect from "~/components/ui/input/InputSelect";
import PeriodHelper, { defaultPeriodFilter, PeriodFilters } from "~/utils/helpers/PeriodHelper";
import { useTranslation } from "react-i18next";
import ServerError from "~/components/ui/errors/ServerError";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { promiseHash } from "~/utils/promises/promiseHash";
import { getTenant } from "~/utils/db/tenants.db.server";
import { Fragment } from "react";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { requireAuth } from "~/utils/loaders.middleware";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = DashboardLoaderData & {
  title: string;
  stats: Stat[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "app.$tenant.dashboard");
  let { t } = await getTranslations(request);
  const tenantId = await time(getTenantIdFromUrl(params), "getTenantIdFromUrl");
  const tenant = await time(getTenant(tenantId), "getTenant");

  const { stats, dashboardData } = await time(
    promiseHash({
      stats: getAppDashboardStats({ t, tenant, gte: PeriodHelper.getGreaterThanOrEqualsFromRequest({ request }) }),
      dashboardData: loadDashboardData({ request, params }),
    }),
    "app.$tenant.dashboard.details"
  );

  const data: LoaderData = {
    title: `${t("app.sidebar.dashboard")} | ${process.env.APP_NAME}`,
    ...dashboardData,
    stats,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

export default function DashboardRoute() {
  const { t } = useTranslation();
  const appData = useAppData();
  const data = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main className="relative z-0 flex-1 pb-8">
      {/*Page header */}
      <div className="bg-background border-border hidden border-b md:block">
        <ProfileBanner user={appData.user} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-8">
        {getUserHasPermission(appData, "app.dashboard.view") ? (
          <Fragment>
            {data.stats.length > 0 && (
              <div className="space-y-3 truncate p-1">
                <div className="flex items-center justify-between space-x-2">
                  <h3 className="text-foreground grow leading-4 font-medium">{t("app.dashboard.summary")}</h3>
                  <div>
                    <InputSelect
                      className="w-44"
                      name="period"
                      value={searchParams.get("period")?.toString() ?? defaultPeriodFilter}
                      options={PeriodFilters.map((f) => {
                        return {
                          value: f.value,
                          name: t(f.name),
                        };
                      })}
                      setValue={(value) => {
                        if (value) {
                          searchParams.set("period", value?.toString() ?? "");
                        } else {
                          searchParams.delete("period");
                        }
                        setSearchParams(searchParams);
                      }}
                    />
                  </div>
                </div>
                <DashboardStats items={data.stats} />
              </div>
            )}
          </Fragment>
        ) : (
          <div className="font-medium">You don't have permission to view the dashboard.</div>
        )}
      </div>
    </main>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
