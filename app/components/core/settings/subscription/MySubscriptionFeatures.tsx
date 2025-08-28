import { useTranslation } from "react-i18next";
import clsx from "clsx";
import MyPlanFeatureUsage from "./MyPlanFeatureUsage";
import { PlanFeatureUsageDto } from "~/application/dtos/subscriptions/PlanFeatureUsageDto";

interface Props {
  features: PlanFeatureUsageDto[];
  className?: string;
  withCurrentPlan: boolean;
  cols?: string;
}

export default function MySubscriptionFeatures({
  features,
  className = "",
  withCurrentPlan = false,
  cols = "grid-cols-2 sm:grid-cols-2 xl:grid-cols-2",
}: Props) {
  const { t } = useTranslation();
  function getTitle(item: PlanFeatureUsageDto) {
    if (item?.entity) {
      return t(item.entity.titlePlural);
    }
    return item?.name ?? "";
  }
  return (
    <div className={className}>
      {features.length === 0 ? (
        <div className="text-muted-foreground text-sm italic">{t("settings.subscription.noSubscription")}</div>
      ) : (
        <>
          <dl
            className={clsx(
              "grid gap-2",
              withCurrentPlan && "mt-2 ",
              features.length === 1 && "grid-cols-1 md:grid-cols-1 xl:grid-cols-1",
              features.length === 2 && "grid-cols-1 md:grid-cols-1 xl:grid-cols-2",
              features.length === 3 && "grid-cols-1 md:grid-cols-1 xl:grid-cols-1",
              features.length === 4 && "grid-cols-1 md:grid-cols-1 xl:grid-cols-2",
              features.length === 5 && "grid-cols-1 md:grid-cols-1 xl:grid-cols-1",
              features.length === 6 && "grid-cols-1 md:grid-cols-3 xl:grid-cols-2"
            )}
          >
            {features.map((item, idx) => {
              return (
                <div key={idx} className="border-border bg-background rounded-lg border p-4 shadow-2xs">
                  <dt className="text-muted-foreground truncate text-xs uppercase tracking-wide">{getTitle(item)}</dt>
                  <dd className="mt-1">
                    <span>{<MyPlanFeatureUsage item={item} />}</span>
                  </dd>
                </div>
              );
            })}
          </dl>
        </>
      )}
    </div>
  );
}
