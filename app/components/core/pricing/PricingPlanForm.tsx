import { Fragment, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, useNavigate, useNavigation, useSubmit } from "react-router";
import { SubscriptionFeatureDto } from "~/application/dtos/subscriptions/SubscriptionFeatureDto";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputCheckboxInline from "~/components/ui/input/InputCheckboxInline";
import InputNumber from "~/components/ui/input/InputNumber";
import InputText, { RefInputText } from "~/components/ui/input/InputText";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import Plan from "../settings/subscription/Plan";
import ToggleBillingPeriod from "../settings/subscription/ToggleBillingPeriod";
import { SubscriptionFeatureLimitType } from "~/application/enums/subscriptions/SubscriptionFeatureLimitType";
import PricingFeaturesTable from "./PricingFeaturesTable";
import { PricingModel } from "~/application/enums/subscriptions/PricingModel";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import { DefaultFeatures } from "~/application/dtos/shared/DefaultFeatures";
import FlatPrices from "./FlatPrices";
import UsageBasedPrices from "./UsageBasedPrices";
import CurrencyToggle from "~/components/ui/toggles/CurrencyToggle";
import currencies from "~/application/pricing/currencies";
import InputSelect from "~/components/ui/input/InputSelect";
import { SubscriptionPriceDto } from "~/application/dtos/subscriptions/SubscriptionPriceDto";
import { SubscriptionUsageBasedPriceDto } from "~/application/dtos/subscriptions/SubscriptionUsageBasedPriceDto";
import billingPeriods from "~/application/pricing/billingPeriods";
import { getSortedBillingPeriods, getSortedCurrencies } from "~/utils/helpers/PricingHelper";
import SettingSection from "~/components/ui/sections/SettingSection";
import { Button } from "~/components/ui/button";
import { TrashIcon } from "lucide-react";

interface Props {
  plans?: SubscriptionProductDto[];
  item?: SubscriptionProductDto | undefined;
  canUpdate?: boolean;
  canDelete?: boolean;
  isPortalPlan?: boolean;
}

export default function PricingPlanForm({ plans, item, canUpdate = true, canDelete, isPortalPlan }: Props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting";
  const navigate = useNavigate();
  const submit = useSubmit();

  let pricingModels = [
    {
      name: t("pricing." + PricingModel[PricingModel.FLAT_RATE]),
      value: PricingModel.FLAT_RATE,
    },
    {
      name: t("pricing." + PricingModel[PricingModel.PER_SEAT]),
      value: PricingModel.PER_SEAT,
    },
    {
      name: t("pricing." + PricingModel[PricingModel.USAGE_BASED]),
      value: PricingModel.USAGE_BASED,
    },
    {
      name: t("pricing." + PricingModel[PricingModel.FLAT_RATE_USAGE_BASED]),
      value: PricingModel.FLAT_RATE_USAGE_BASED,
    },
    {
      name: t("pricing." + PricingModel[PricingModel.ONCE]),
      value: PricingModel.ONCE,
    },
  ];
  if (isPortalPlan) {
    pricingModels = pricingModels.filter(
      (f) => f.value !== PricingModel.USAGE_BASED && f.value !== PricingModel.FLAT_RATE_USAGE_BASED && f.value !== PricingModel.PER_SEAT
    );
  }
  const inputTitle = useRef<RefInputText>(null);
  const confirmRemove = useRef<RefConfirmModal>(null);

  const [order, setOrder] = useState<number | undefined>(item?.order ?? getNextOrder());
  const [title, setTitle] = useState(item?.title ?? "");
  const [description, setDescription] = useState(item?.description ?? "");
  const [groupTitle, setGroupTitle] = useState(item?.groupTitle ?? "");
  const [groupDescription, setGroupDescription] = useState(item?.groupDescription ?? "");
  const [model, setModel] = useState(item?.model ?? PricingModel.FLAT_RATE);
  const [badge, setBadge] = useState(item?.badge ?? "");
  const [isPublic, setIsPublic] = useState(item ? item.public : true);
  const [features, setFeatures] = useState<SubscriptionFeatureDto[]>([]);
  const [billingAddressCollection, setBillingAddressCollection] = useState(item?.billingAddressCollection === "required" ? true : false);
  const [hasQuantity, setHasQuantity] = useState(item?.hasQuantity ?? false);
  const [canBuyAgain, setCanBuyAgain] = useState(item?.canBuyAgain ?? false);

  const [prices, setPrices] = useState<SubscriptionPriceDto[]>(item?.prices ?? []);
  const [usageBasedPrices, setUsageBasedPrices] = useState<SubscriptionUsageBasedPriceDto[]>(item?.usageBasedPrices ?? []);

  const [billingPeriod, setBillingPeriod] = useState<SubscriptionBillingPeriod>(
    billingPeriods.find((f) => f.default)?.value ?? SubscriptionBillingPeriod.MONTHLY
  );
  const [currency, setCurrency] = useState(currencies.find((f) => f.default)?.value ?? "");

  useEffect(() => {
    inputTitle.current?.input.current?.focus();
    inputTitle.current?.input.current?.select();

    if (item) {
      setFeatures(item.features);
    } else {
      if (!isPortalPlan) {
        const features: SubscriptionFeatureDto[] = [
          {
            order: 1,
            title: "1 user",
            name: DefaultFeatures.Users,
            type: SubscriptionFeatureLimitType.MAX,
            value: 1,
            accumulate: false,
          },
        ];
        // appOrAdminData.entities
        //   .filter((f) => f.active && (f.type === DefaultEntityTypes.AppOnly || f.type === DefaultEntityTypes.All))
        //   .forEach((entity) => {
        //     features.push({
        //       order: features.length + 1,
        //       title: "100 " + t(entity.titlePlural).toLowerCase() + "/month",
        //       name: entity.name,
        //       type: SubscriptionFeatureLimitType.MONTHLY,
        //       value: 100,
        //       accumulate: false,
        //     });
        //   });
        features.push({
          order: features.length + 1,
          title: "Priority support",
          name: DefaultFeatures.PrioritySupport,
          type: SubscriptionFeatureLimitType.NOT_INCLUDED,
          value: 0,
          accumulate: false,
        });
        setFeatures(features);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (model === PricingModel.ONCE) {
      setBillingPeriod(SubscriptionBillingPeriod.ONCE);
    } else {
      setBillingPeriod(SubscriptionBillingPeriod.MONTHLY);
    }
  }, [model, item]);

  useEffect(() => {
    const possibleBillingPeriods = prices.filter((f) => f.price).flatMap((f) => f.billingPeriod);
    if (possibleBillingPeriods.includes(SubscriptionBillingPeriod.MONTHLY)) {
      setBillingPeriod(SubscriptionBillingPeriod.MONTHLY);
    } else {
      let found = -1;
      billingPeriods
        .filter((f) => !f.disabled)
        .forEach((billingPeriod) => {
          if (found === -1 && possibleBillingPeriods.includes(billingPeriod.value)) {
            found = billingPeriod.value;
          }
        });
      if (found !== -1) {
        setBillingPeriod(found);
      }
    }

    const possibleCurrencies = prices.filter((f) => f.price).flatMap((f) => f.currency);
    const defaultCurrency = currencies.find((f) => f.default)?.value ?? "usd";
    if (possibleCurrencies.includes(defaultCurrency)) {
      setCurrency(defaultCurrency);
    } else if (possibleCurrencies.length > 0) {
      setCurrency(possibleCurrencies[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function close() {
    navigate("/admin/settings/pricing", { replace: true });
  }

  function remove() {
    confirmRemove.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function getNextOrder() {
    if (!plans || plans?.length === 0) {
      return 1;
    }
    return Math.max(...plans.map((o) => o.order)) + 1;
  }
  function getYearlyDiscount(): string | undefined {
    const priceYearly = prices.find((f) => f.currency === currency && f.billingPeriod === SubscriptionBillingPeriod.YEARLY);
    const priceMonthly = prices.find((f) => f.currency === currency && f.billingPeriod === SubscriptionBillingPeriod.MONTHLY);
    if (priceYearly && priceMonthly) {
      const discount = 100 - (Number(priceYearly.price) * 100) / (Number(priceMonthly.price) * 12);
      if (discount !== 0) {
        return "-" + discount.toFixed(0) + "%";
      }
    }
    return undefined;
  }

  function yesRemove() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }

  const possibleBillingPeriods = () => {
    if (model === PricingModel.ONCE) {
      return [SubscriptionBillingPeriod.ONCE];
    }
    let periods = prices.filter((f) => f.price).flatMap((f) => f.billingPeriod);
    // remove duplicates
    periods = periods.filter((v, i, a) => a.indexOf(v) === i);
    return getSortedBillingPeriods(periods);
  };

  const possibleCurrencies = () => {
    let currencies = prices.filter((f) => f.price).flatMap((f) => f.currency);
    // remove duplicates
    currencies = currencies.filter((v, i, a) => a.indexOf(v) === i);
    return getSortedCurrencies(currencies);
  };

  return (
    <>
      <Form method="post">
        <input hidden readOnly name="action" value={item ? "edit" : "create"} />

        <div className="col-span-2 mx-auto">
          <div>
            <SettingSection title="Product details" description="Set a public or custom plan">
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-12">
                <div className="sm:col-span-3">
                  <InputNumber
                    name="order"
                    title={t("models.subscriptionProduct.order")}
                    value={order}
                    setValue={setOrder}
                    disabled={loading}
                    required={true}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputText
                    ref={inputTitle}
                    name="title"
                    title={t("models.subscriptionProduct.title")}
                    value={title}
                    setValue={setTitle}
                    disabled={loading}
                    autoComplete="off"
                    minLength={1}
                    maxLength={99}
                    required={true}
                    withTranslation={true}
                    help="You can use i18n keys to translate the Plan title to the current user's language"
                  />
                </div>
                <div className="sm:col-span-3">
                  <InputText
                    name="badge"
                    title={t("models.subscriptionProduct.badge")}
                    value={badge}
                    setValue={setBadge}
                    disabled={loading}
                    autoComplete="off"
                    withTranslation={true}
                  />
                </div>
                {/* <div className="sm:col-span-9">
                  <InputText name="model-description" title={"Model description"} value={getModelDescription()} disabled={true} />
                </div> */}
                {!isPortalPlan && (
                  <Fragment>
                    <div className="sm:col-span-4">
                      <InputText
                        name="group-title"
                        title={t("models.subscriptionProduct.groupTitle")}
                        value={groupTitle}
                        setValue={setGroupTitle}
                        disabled={loading}
                        autoComplete="off"
                        withTranslation={true}
                      />
                    </div>
                    <div className="sm:col-span-8">
                      <InputText
                        name="group-description"
                        title={t("models.subscriptionProduct.groupDescription")}
                        value={groupDescription}
                        setValue={setGroupDescription}
                        disabled={loading}
                        autoComplete="off"
                        withTranslation={true}
                      />
                    </div>
                  </Fragment>
                )}
                <div className="sm:col-span-12">
                  <InputText
                    name="description"
                    title={t("models.subscriptionProduct.description")}
                    value={description}
                    setValue={setDescription}
                    disabled={loading}
                    minLength={1}
                    maxLength={999}
                    autoComplete="off"
                    withTranslation={true}
                  />
                </div>

                <div className="sm:col-span-12">
                  <InputSelect
                    name="model"
                    title={t("models.subscriptionProduct.model")}
                    value={model}
                    setValue={(e) => {
                      setModel(Number(e));
                    }}
                    options={pricingModels}
                    disabled={item !== undefined}
                  />
                </div>
                <div className="space-y-2 sm:col-span-12">
                  <InputCheckboxInline
                    name="is-public"
                    title={t("models.subscriptionProduct.public")}
                    value={isPublic}
                    setValue={setIsPublic}
                    description={
                      <>
                        <span className="text-muted-foreground font-normal">: is visible to SaaS users</span>
                      </>
                    }
                  />
                </div>
                <div className="space-y-2 sm:col-span-12">
                  <InputCheckboxInline
                    name="is-billing-required"
                    title={t("models.subscriptionProduct.billingAddressCollection")}
                    value={billingAddressCollection}
                    setValue={setBillingAddressCollection}
                    description={
                      <>
                        <span className="text-muted-foreground font-normal">: is required to collect the billing address from the user</span>
                      </>
                    }
                  />
                </div>
                {model === PricingModel.ONCE && (
                  <div className="space-y-2 sm:col-span-12">
                    <InputCheckboxInline
                      name="has-quantity"
                      title="Has quantity"
                      value={hasQuantity}
                      setValue={setHasQuantity}
                      description={
                        <>
                          <span className="text-muted-foreground font-normal">: is possible to buy more than one</span>
                        </>
                      }
                    />
                  </div>
                )}
                {model === PricingModel.ONCE && (
                  <div className="space-y-2 sm:col-span-12">
                    <InputCheckboxInline
                      name="can-buy-again"
                      title="Can buy again"
                      value={canBuyAgain}
                      setValue={setCanBuyAgain}
                      description={
                        <>
                          <span className="text-muted-foreground font-normal">: users can buy even if they already bought it</span>
                        </>
                      }
                    />
                  </div>
                )}
              </div>
            </SettingSection>

            {/*Separator */}
            <div className="block">
              <div className="py-5">
                <div className=""></div>
              </div>
            </div>

            {[PricingModel.FLAT_RATE, PricingModel.PER_SEAT, PricingModel.FLAT_RATE_USAGE_BASED, PricingModel.ONCE].includes(model) && (
              <SettingSection title="Flat prices" description="Set the monthly and yearly price" className="">
                <FlatPrices model={model} prices={prices} setPrices={setPrices} disabled={item !== undefined} isPortalPlan={isPortalPlan} />
              </SettingSection>
            )}

            {(model === PricingModel.FLAT_RATE_USAGE_BASED || model === PricingModel.USAGE_BASED) && (
              <SettingSection title="Usage-based prices" description="Additional to a flat fee, charge your users based on their usage." className="">
                <UsageBasedPrices initial={usageBasedPrices} onUpdate={(items) => setUsageBasedPrices(items)} disabled={item !== undefined} />
              </SettingSection>
            )}

            {/*Separator */}
            <div className="block">
              <div className="py-5">
                <div className=""></div>
              </div>
            </div>

            <SettingSection title="Features" description="Set the features" className="">
              <PricingFeaturesTable plans={plans} items={features} setItems={setFeatures} />
            </SettingSection>

            {/*Separator */}
            <div className="block">
              <div className="py-5">
                <div className=""></div>
              </div>
            </div>

            <SettingSection title="Preview" description="This is how the plan looks like">
              <div className="flex justify-between space-x-2">
                <CurrencyToggle value={currency} setValue={setCurrency} possibleCurrencies={possibleCurrencies()} />
                <ToggleBillingPeriod
                  size="sm"
                  currency={currency}
                  products={plans ?? []}
                  // className="mt-10"
                  billingPeriod={billingPeriod}
                  onChange={setBillingPeriod}
                  yearlyDiscount={getYearlyDiscount()}
                  possibleBillingPeriods={possibleBillingPeriods()}
                />
              </div>
              <div className="mt-6">
                <Plan
                  title={title}
                  description={description}
                  badge={badge}
                  features={features}
                  billingPeriod={billingPeriod}
                  currency={currency}
                  model={model}
                  prices={prices}
                  usageBasedPrices={usageBasedPrices}
                  stripeCoupon={null}
                  isPreview={true}
                />
              </div>
            </SettingSection>
          </div>

          <div className="flex justify-end space-x-2 py-5">
            <div>
              {item && (
                <Button type="button" variant="ghost" disabled={loading || !canDelete} onClick={remove}>
                  <TrashIcon className="text-muted-foreground size-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button type="button" variant="outline" disabled={loading} onClick={close}>
                <div>{t("shared.cancel")}</div>
              </Button>
              <LoadingButton type="submit" disabled={loading || !canUpdate}>
                {t("shared.save")}
              </LoadingButton>
            </div>
          </div>
        </div>
      </Form>

      <ConfirmModal ref={confirmRemove} onYes={yesRemove} destructive />
    </>
  );
}
