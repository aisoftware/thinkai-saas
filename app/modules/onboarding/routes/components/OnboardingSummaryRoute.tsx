import { useTranslation } from "react-i18next";
import NumberUtils from "~/utils/shared/NumberUtils";
import OnboardingSessionsTable from "../../components/OnboardingSessionsTable";
import { OnboardingSummaryApi } from "../api/OnboardingSummaryApi.server";
import { useLoaderData } from "react-router";

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<OnboardingSummaryApi.LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-border border-b pb-5">
        <h3 className="text-foreground text-lg leading-6 font-medium">{t("shared.overview")}</h3>
      </div>
      <dl className="grid gap-2 sm:grid-cols-3">
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Onboarding sessions</div>
          </dt>
          <dd className="text-foreground mt-1 flex items-baseline space-x-1 truncate text-2xl font-semibold">
            <div>
              {NumberUtils.intFormat(data.summary.sessions.active)}/{NumberUtils.intFormat(data.summary.sessions.all)}
            </div>
            <div className="text-muted-foreground text-sm font-normal lowercase">{t("shared.active")}</div>
          </dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Dismissed</div>
          </dt>
          <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.sessions.dismissed)}</dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Completed</div>
          </dt>
          <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.sessions.completed)}</dd>
        </div>
      </dl>

      <div className="mt-4 space-y-4">
        <h3 className="text-foreground leading-4 font-medium">Latest sessions</h3>
        <OnboardingSessionsTable items={data.sessions.items} metadata={data.sessions.metadata} />
      </div>
    </div>
  );
}
