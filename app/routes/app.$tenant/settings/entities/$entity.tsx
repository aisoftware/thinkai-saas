import { ActionFunction, LoaderFunctionArgs, useLoaderData, useNavigate, useOutlet } from "react-router";
import { Outlet, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import TenantPropertiesList from "~/components/entities/properties/TenantPropertiesList";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import { PropertiesApi } from "~/utils/api/.server/PropertiesApi";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppData } from "~/utils/data/useAppData";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { PropertyWithDetails, getEntityBySlug, EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { deleteProperty, getProperty, updateProperty, updatePropertyOrder } from "~/utils/db/entities/properties.db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";

type LoaderData = {
  entity: EntityWithDetails;
  properties: PropertyWithDetails[];
  allEntities: EntityWithDetails[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.app.features.tenantEntityCustomization) {
    throw Error("Entity customization is not enabled");
  }
  const tenantId = await getTenantIdOrNull({ request, params });
  const entity = await getEntityBySlug({ tenantId, slug: params.entity ?? "" });
  const data: LoaderData = {
    entity,
    properties: entity.properties,
    allEntities: await getAllEntities({ tenantId }),
  };
  return success(data);
};

type ActionData = {
  error?: string;
  properties?: PropertyWithDetails[];
  created?: boolean;
  updated?: boolean;
  deleted?: boolean;
};
const success = (data: ActionData) => Response.json(data, { status: 200 });
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdOrNull({ request, params });

  const entity = await getEntityBySlug({ tenantId, slug: params.entity ?? "" });

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  if (action === "set-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updatePropertyOrder(id, Number(order));
      })
    );
    return Response.json({ updated: true });
  } else if (action === "delete") {
    const id = form.get("id")?.toString() ?? "";
    const existingProperty = await getProperty(id);
    if (!existingProperty) {
      return badRequest({ error: t("shared.notFound") });
    }
    await deleteProperty(id);
    return success({
      properties: (await getEntityBySlug({ tenantId, slug: params.entity ?? "" }))?.properties,
      deleted: true,
    });
    // return redirect(`/admin/entities/${params.entity}/properties`);
  } else if (action === "toggle-display") {
    const id = form.get("id")?.toString() ?? "";
    const existingProperty = await getProperty(id);
    if (!existingProperty) {
      return badRequest({ error: t("shared.notFound") });
    }
    await updateProperty(id, {
      isDisplay: !existingProperty.isDisplay,
    });
    return Response.json({});
    // return redirect(`/admin/entities/${params.entity}/properties`);
  } else if (action === "duplicate") {
    try {
      const propertyId = form.get("id")?.toString() ?? "";
      await PropertiesApi.duplicate({ entity, propertyId });
      return Response.json({ created: true });
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  }
  return badRequest({ error: t("shared.invalidForm") });
};

export default function () {
  const { t } = useTranslation();
  const appData = useAppData();
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const params = useParams();

  return (
    <EditPageLayout
      title={`${t(data.entity.title)} - ${t("models.property.plural")}`}
      withHome={false}
      menu={[
        {
          title: t("models.entity.plural"),
          routePath: UrlUtils.getModulePath(params, `entities`),
        },
        {
          title: data.entity.titlePlural,
          routePath: UrlUtils.getModulePath(params, `entities/${data.entity.slug}`),
        },
      ]}
    >
      <TenantPropertiesList tenantId={appData.currentTenant.id} items={data.properties} />
      <SlideOverWideEmpty
        title={params.id ? t("shared.edit") : t("shared.new")}
        open={!!outlet}
        onClose={() => {
          navigate(".", { replace: true });
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{outlet}</div>
        </div>
      </SlideOverWideEmpty>
    </EditPageLayout>
  );
}
