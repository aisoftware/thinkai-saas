import { useTranslation } from "react-i18next";
import { PlanFeatureUsageDto } from "~/application/dtos/subscriptions/PlanFeatureUsageDto";
import { SubscriptionFeatureLimitType } from "~/application/enums/subscriptions/SubscriptionFeatureLimitType";
import DateUtils from "~/utils/shared/DateUtils";

interface Props {
  item: PlanFeatureUsageDto | undefined;
}
export default function MyPlanFeatureUsage({ item }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      {item ? (
        <div>
          {/* {JSON.stringify(item)} */}

          <div className="flex items-baseline space-x-1 font-medium">
            {item.type === SubscriptionFeatureLimitType.INCLUDED && (
              <span className="text-foreground flex items-center space-x-1 truncate text-sm">
                {/* <CheckIcon className={clsx(" text-center h-5 w-5")} /> */}
                <span>{t("pricing.included")}</span>
              </span>
            )}
            {item.type === SubscriptionFeatureLimitType.NOT_INCLUDED && (
              <span className="text-foreground flex items-center space-x-1 truncate text-sm">
                {/* <XIcon className={clsx(" text-center h-5 w-5")} /> */}
                <span>{t("pricing.notIncluded")}</span>
              </span>
            )}
            {item.type === SubscriptionFeatureLimitType.MONTHLY && (
              <span className="text-foreground flex items-baseline space-x-1 text-sm lowercase">
                <span>
                  {item.used}/{item.value}
                </span>
                <span className="text-muted-foreground text-xs font-normal lowercase">
                  {item.period ? (
                    <span>
                      ({DateUtils.dateYMD(item.period.firstDay)} - {DateUtils.dateYMD(item.period.lastDay)})
                    </span>
                  ) : (
                    <span>({t("pricing.thisMonth")})</span>
                  )}
                </span>
              </span>
            )}
            {item.type === SubscriptionFeatureLimitType.MAX && (
              <span className="text-foreground lowercase">
                {item.used}/{item.value}
              </span>
            )}
            {item.type === SubscriptionFeatureLimitType.UNLIMITED && (
              <span className="text-foreground flex items-center space-x-1 truncate text-sm">{t("shared.unlimited")}</span>
            )}
          </div>
          {/* <span className="mt-2 text-red-700 text-xs font-normal">{item.message ?? ""}</span> */}
        </div>
      ) : (
        <span className=" text-muted-foreground">-</span>
      )}
    </div>
  );
}
