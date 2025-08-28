import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useSearchParams } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { DashboardStats } from "~/components/ui/stats/DashboardStats";
import { getAdminDashboardStats } from "~/utils/services/adminDashboardService";
import { getSetupSteps } from "~/utils/services/setupService";
import SetupSteps from "~/components/admin/SetupSteps";
import ProfileBanner from "~/components/app/ProfileBanner";
import { adminGetAllTenantsWithUsage, TenantWithUsage } from "~/utils/db/tenants.db.server";
import TenantsTable from "~/components/core/tenants/TenantsTable";
import { SetupItem } from "~/application/dtos/setup/SetupItem";
import { Stat } from "~/application/dtos/stats/Stat";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { useTranslation } from "react-i18next";
import PeriodHelper, { defaultPeriodFilter, PeriodFilters } from "~/utils/helpers/PeriodHelper";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { promiseHash } from "~/utils/promises/promiseHash";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import InputSelect from "~/components/ui/input/InputSelect";
import { requireAuth } from "~/utils/loaders.middleware";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  stats: Stat[];
  setupSteps: SetupItem[];
  tenants: {
    items: TenantWithUsage[];
    pagination: PaginationDto;
  };
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.dashboard");
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);

  const { t } = await time(getTranslations(request), "getTranslations");
  const { stats, setupSteps, tenants } = await time(
    promiseHash({
      stats: time(
        getAdminDashboardStats({ gte: PeriodHelper.getGreaterThanOrEqualsFromRequest({ request }) }),
        "admin.dashboard.details.getAdminDashboardStats"
      ),
      setupSteps: time(getSetupSteps(), "admin.dashboard.details.getSetupSteps"),
      tenants: time(adminGetAllTenantsWithUsage(undefined, currentPagination), "admin.dashboard.details.adminGetAllTenantsWithUsage"),
    }),
    "admin.dashboard.details"
  );

  const data: LoaderData = {
    title: `${t("app.sidebar.dashboard")} | ${process.env.APP_NAME}`,
    stats,
    setupSteps,
    tenants,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

export default function AdminNavigationRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const appOrAdminData = useAppOrAdminData();
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <main className="relative z-0 flex-1 pb-8">
      {/*Page header */}
      <div className="bg-background lg:border-border hidden shadow-xs md:block lg:border-t">
        <ProfileBanner user={appOrAdminData.user} />
      </div>

      <div className="mx-auto grid max-w-5xl gap-5 px-4 py-5 sm:px-8">
        {getUserHasPermission(appOrAdminData, "admin.dashboard.view") ? (
          <div className="space-y-5 overflow-hidden">
            <div className="overflow-x-auto">
              {data.setupSteps.filter((f) => f.completed).length < data.setupSteps.length && <SetupSteps items={data.setupSteps} />}
            </div>

            <div className="space-y-3 truncate p-1">
              <div className="flex items-center justify-between space-x-2">
                <h3 className="text-foreground grow font-medium leading-4">{t("app.dashboard.summary")}</h3>
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

            <div className="space-y-4 overflow-x-auto p-1">
              <div className="flex items-center justify-between space-x-2">
                <h3 className="text-foreground font-medium leading-4">{t("models.tenant.plural")}</h3>
                <ButtonSecondary to="/admin/accounts">{t("shared.viewAll")}</ButtonSecondary>
              </div>
              <TenantsTable items={data.tenants.items} pagination={data.tenants.pagination} />
            </div>
          </div>
        ) : (
          <div className="font-medium">You don't have permission to view the dashboard.</div>
        )}
      </div>
    </main>
  );
}
