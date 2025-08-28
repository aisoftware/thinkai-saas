import { useTranslation } from "react-i18next";
import { SubscriptionUsageBasedPriceDto } from "~/application/dtos/subscriptions/SubscriptionUsageBasedPriceDto";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { SubscriptionUsageBasedUnitDto } from "~/application/dtos/subscriptions/SubscriptionUsageBasedUnitDto";
import UsageBasedPricesUnit from "./UsageBasedPricesUnit";
import CollapsibleRow from "~/components/ui/tables/CollapsibleRow";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";

interface Props {
  initial: SubscriptionUsageBasedPriceDto[];
  onUpdate: (items: SubscriptionUsageBasedPriceDto[]) => void;
  disabled: boolean;
}
export default function UsageBasedPrices({ initial, onUpdate, disabled }: Props) {
  const { t } = useTranslation();

  const [units, setUnits] = useState<SubscriptionUsageBasedUnitDto[]>([]);
  const [usageBasedPrices, setUsageBasedPrices] = useState<SubscriptionUsageBasedPriceDto[]>(initial);

  useEffect(() => {
    const units: SubscriptionUsageBasedUnitDto[] = [];
    usageBasedPrices.forEach((usageBasedPrice) => {
      const unit = units.find((f) => f.unit === usageBasedPrice.unit);
      if (!unit) {
        units.push({
          unit: usageBasedPrice.unit,
          unitTitle: usageBasedPrice.unitTitle,
          unitTitlePlural: usageBasedPrice.unitTitlePlural,
          usageType: usageBasedPrice.usageType,
          aggregateUsage: usageBasedPrice.aggregateUsage,
          tiersMode: usageBasedPrice.tiersMode,
          billingScheme: usageBasedPrice.billingScheme,
          tiers: [],
          prices: [],
        });
      }
    });
    if (units.length === 0) {
      units.push({
        unit: "",
        unitTitle: "",
        unitTitlePlural: "",
        usageType: "metered",
        tiersMode: "volume",
        aggregateUsage: "sum",
        billingScheme: "tiered",
        tiers: [],
        prices: [],
      });
    }
    units.forEach((unit) => {
      const prices = usageBasedPrices.filter((f) => f.unit === unit.unit);
      prices.forEach((price) => {
        price.tiers.forEach((tier) => {
          const existingTier = unit.tiers.find((f) => f.from === tier.from && (f.to === tier.to || (!f.to && !tier.to)));
          if (!existingTier) {
            unit.tiers.push({
              from: tier.from,
              to: tier.to ? Number(tier.to) : undefined,
            });
          }
          unit.prices.push({
            currency: price.currency,
            from: tier.from ?? undefined,
            to: tier.to ?? undefined,
            perUnitPrice: tier.perUnitPrice ? Number(tier.perUnitPrice) : undefined,
            flatFeePrice: tier.flatFeePrice ? Number(tier.flatFeePrice) : undefined,
          });
        });
      });
    });

    setUnits(units);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const usageBasedPrices: SubscriptionUsageBasedPriceDto[] = [];
    units.forEach((unit) => {
      unit.prices
        .sort((a, b) => a.from - b.from)
        .forEach((price) => {
          const unitTier = {
            id: "",
            subscriptionUsageBasedPriceId: "",
            from: price.from,
            to: price.to,
            perUnitPrice: price.perUnitPrice,
            flatFeePrice: price.flatFeePrice,
          };
          const existing = usageBasedPrices.find((f) => f.unit === unit.unit && f.currency === price.currency);
          if (existing) {
            existing.tiers.push(unitTier);
          } else {
            usageBasedPrices.push({
              id: "",
              subscriptionProductId: "",
              stripeId: "",
              billingPeriod: SubscriptionBillingPeriod.MONTHLY,
              currency: price.currency,
              unit: unit.unit,
              unitTitle: unit.unitTitle,
              unitTitlePlural: unit.unitTitlePlural,
              usageType: unit.usageType,
              aggregateUsage: unit.aggregateUsage,
              tiersMode: unit.tiersMode,
              billingScheme: unit.billingScheme,
              tiers: [unitTier],
            });
          }
        });
    });
    setUsageBasedPrices(usageBasedPrices);
  }, [units]);

  useEffect(() => {
    onUpdate(usageBasedPrices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usageBasedPrices]);

  function addUnit() {
    setUnits([
      ...units,
      {
        unit: "",
        unitTitle: "",
        unitTitlePlural: "",
        usageType: "metered",
        aggregateUsage: "sum",
        tiersMode: "volume",
        billingScheme: "tiered",
        tiers: [],
        prices: [],
      },
    ]);
  }

  function removeUnit(item: SubscriptionUsageBasedUnitDto) {
    setUnits(units.filter((f) => f !== item));
  }

  function updateUnit(idx: number, item: SubscriptionUsageBasedUnitDto) {
    const newUnits = [...units];
    newUnits[idx] = item;
    setUnits(newUnits);
  }

  return (
    <div className="space-y-2">
      {units.map((item, idx) => {
        return (
          <div key={idx} className="space-y-3">
            <CollapsibleRow
              initial={!disabled}
              className="bg-secondary"
              key={idx}
              value={
                <div className="flex flex-col truncate">
                  <h3 className="text-foreground text-sm font-bold">
                    {item.unitTitle} ({item.unit})
                  </h3>
                  <div className="text-muted-foreground truncate text-xs italic">
                    {t("pricing.usageBased.unit")} #{idx + 1}
                  </div>
                </div>
              }
              title={`${t("pricing.usageBased.unit")} #${idx + 1}`}
              onRemove={() => removeUnit(item)}
              disabled={disabled}
            >
              <UsageBasedPricesUnit key={idx} item={item} onUpdate={(item) => updateUnit(idx, item)} disabled={disabled} />
            </CollapsibleRow>
          </div>
        );
      })}

      <button
        type="button"
        onClick={addUnit}
        disabled={disabled}
        className={clsx(
          "border-border text-muted-foreground focus:text-foreground bg-background flex items-center space-x-1 rounded-md border px-2 py-1 text-xs focus:ring-3 focus:ring-gray-300 focus:ring-offset-1",
          disabled ? "bg-secondary cursor-not-allowed" : "hover:bg-secondary/90"
        )}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <span className="font-medium uppercase">{t("shared.add")}</span>
      </button>

      {/* {JSON.stringify(usageBasedPrices)} */}
      {usageBasedPrices.map((item, idx) => {
        return (
          <div key={idx}>
            <input readOnly hidden type="text" id="usage-based-prices[]" name="usage-based-prices[]" value={JSON.stringify(item)} />
          </div>
        );
      })}

      {/* <UsageBasedPricesUnitForm ref={usageBasedPriceUnitForm} onAdded={set} /> */}
    </div>
  );
}
