import { useTranslation } from "react-i18next";
import { useEffect, useRef } from "react";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useActionData, useLoaderData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { deletePlan, updatePlan } from "~/utils/services/.server/pricingService";
import PricingPlanForm from "~/components/core/pricing/PricingPlanForm";
import { getAllSubscriptionProducts, getSubscriptionProduct } from "~/utils/db/subscriptionProducts.db.server";
import { createAdminLog } from "~/utils/db/logs.db.server";
import { SubscriptionFeatureDto } from "~/application/dtos/subscriptions/SubscriptionFeatureDto";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { useAdminData } from "~/utils/data/useAdminData";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import { toast } from "sonner";

export const meta: v2MetaFunction<typeof loader> = ({ data }) => (data && "metatags" in data ? data.metatags : []);

type LoaderData = {
  metatags: MetaTagsDto;
  item: SubscriptionProductDto;
  plans: SubscriptionProductDto[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.pricing.view");
  const { t } = await getTranslations(request);

  const item = await getSubscriptionProduct(params.id ?? "");
  if (!item) {
    throw redirect("/admin/settings/pricing");
  }

  const data: LoaderData = {
    metatags: [{ title: `${t("admin.pricing.edit")} | ${process.env.APP_NAME}` }],
    item,
    plans: await getAllSubscriptionProducts(),
  };
  return Response.json(data);
};

type ActionData = {
  error?: string;
  success?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.pricing.update");
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString();
  const item = await getSubscriptionProduct(params.id ?? "");
  if (!item) {
    return badRequest({ error: t("shared.notFound") });
  }
  if (action === "edit") {
    const order = Number(form.get("order"));
    const title = form.get("title")?.toString();
    const description = form.get("description")?.toString() ?? "";
    const badge = form.get("badge")?.toString() ?? "";
    const groupTitle = form.get("group-title")?.toString() ?? "";
    const groupDescription = form.get("group-description")?.toString() ?? "";
    const isPublic = Boolean(form.get("is-public"));
    const isBillingRequired = Boolean(form.get("is-billing-required"));
    const hasQuantity = Boolean(form.get("has-quantity"));
    const canBuyAgain = Boolean(form.get("can-buy-again"));

    const featuresArr = form.getAll("features[]");
    const features: SubscriptionFeatureDto[] = featuresArr.map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    if (!title) {
      return badRequest({ error: "Title required" });
    }

    const plan: SubscriptionProductDto = {
      id: params.id,
      stripeId: "",
      order,
      title,
      description,
      badge,
      groupTitle,
      groupDescription,
      active: true,
      model: item.model,
      public: isPublic,
      prices: [],
      usageBasedPrices: [],
      features: [],
      billingAddressCollection: isBillingRequired ? "required" : "auto",
      hasQuantity,
      canBuyAgain,
    };

    try {
      await updatePlan(plan, features);
      await createAdminLog(request, "Updated pricing plan", plan.translatedTitle ?? plan.title);

      return redirect("/admin/settings/pricing");
    } catch (e: any) {
      return badRequest({ error: e?.toString() });
    }
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.pricing.delete");
    if (!item) {
      return badRequest({ error: "Pricing plan not found" });
    }
    try {
      await deletePlan(item);
      return redirect("/admin/settings/pricing");
    } catch (error: any) {
      return badRequest({ error: error.message });
    }
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};

export default function EditPricinPlanRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const adminData = useAdminData();
  const { t } = useTranslation();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout title={<BackButtonWithTitle href="/admin/settings/pricing">Edit: {t(data.item.title)}</BackButtonWithTitle>}>
      <PricingPlanForm
        item={data.item}
        plans={data.plans}
        canUpdate={getUserHasPermission(adminData, "admin.pricing.update")}
        canDelete={getUserHasPermission(adminData, "admin.pricing.delete")}
      />
    </EditPageLayout>
  );
}
