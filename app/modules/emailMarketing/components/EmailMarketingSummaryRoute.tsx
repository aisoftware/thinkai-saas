import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import NumberUtils from "~/utils/shared/NumberUtils";
import { EmailMarketing_Summary } from "../routes/EmailMarketing_Summary";

export default function EmailMarketingSummaryRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<EmailMarketing_Summary.LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-border border-b pb-5">
        <h3 className="text-foreground text-lg leading-6 font-medium">{t("shared.overview")}</h3>
      </div>
      <dl className="grid gap-2 sm:grid-cols-3">
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>{t("emailMarketing.overview.avgOpenRate")}</div>
          </dt>
          <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.decimalFormat(data.summary.avgOpenRate)}%</dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>{t("emailMarketing.overview.avgClickRate")}</div>
          </dt>
          <dd className="text-foreground mt-1 truncate text-2xl font-semibold">{NumberUtils.decimalFormat(data.summary.avgClickRate)}%</dd>
        </div>
        <div className="bg-card overflow-hidden rounded-lg px-4 py-3 shadow-xs">
          <dt className="text-muted-foreground flex items-center space-x-2 truncate text-xs font-medium uppercase">
            <ColorBadge color={Colors.GREEN} />
            <div>{t("emailMarketing.overview.totalSent")}</div>
          </dt>
          <dd className="text-foreground mt-1 flex items-baseline space-x-1 truncate text-2xl font-semibold">
            <div>
              {NumberUtils.numberFormat(data.summary.outboundEmails.delivered)}/{NumberUtils.numberFormat(data.summary.outboundEmails.sent)}
            </div>
            <div className="text-muted-foreground text-xs font-normal lowercase">{t("emails.delivered")}</div>
          </dd>
        </div>
      </dl>
    </div>
  );
}
