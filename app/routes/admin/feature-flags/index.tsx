import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import { getAllFeatureFlags } from "~/modules/featureFlags/db/featureFlags.db.server";
import { db } from "~/utils/db.server";
import NumberUtils from "~/utils/shared/NumberUtils";

type LoaderData = {
  summary: {
    flagsTotal: number;
    flagsEnabled: number;
    triggersTotal: number;
  };
};
export const loader = async () => {
  const items = await getAllFeatureFlags();
  const triggersTotal = await db.analyticsEvent.count({
    where: { featureFlagId: { not: null } },
  });
  const data: LoaderData = {
    summary: {
      flagsTotal: items.length,
      flagsEnabled: items.filter((f) => f.enabled).length,
      triggersTotal,
    },
  };
  return Response.json(data);
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-border border-b pb-5">
        <h3 className="text-lg font-medium leading-6">{t("shared.overview")}</h3>
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground flex items-center space-x-2 truncate text-xs font-medium uppercase">
            <ColorBadge color={Colors.GREEN} />
            <div>{t("featureFlags.plural")}</div>
          </dt>
          <dd className="mt-1 flex items-baseline space-x-1 truncate text-2xl font-semibold">
            <div>
              {NumberUtils.numberFormat(data.summary.flagsEnabled)}/{NumberUtils.numberFormat(data.summary.flagsTotal)}
            </div>
            <div className="text-muted-foreground text-xs font-normal lowercase">{t("featureFlags.enabled")}</div>
          </dd>
        </div>
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>{t("featureFlags.triggers")}</div>
          </dt>
          <dd className="mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.triggersTotal)}</dd>
        </div>
      </dl>
    </div>
  );
}
