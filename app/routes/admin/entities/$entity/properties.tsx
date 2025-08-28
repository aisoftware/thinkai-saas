import { ActionFunction, LoaderFunctionArgs, redirect, useLoaderData, useNavigate, useOutlet, useParams } from "react-router";
import { Outlet } from "react-router";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import PropertiesList from "~/components/entities/properties/PropertiesList";
import RowForm from "~/components/entities/rows/RowForm";
import RowTitle from "~/components/entities/rows/RowTitle";
import RowsList from "~/components/entities/rows/RowsList";
import InfoBanner from "~/components/ui/banners/InfoBanner";
import { getTranslations } from "~/locale/i18next.server";
import { EntityViewLayoutTypes } from "~/modules/rows/dtos/EntityViewLayoutType";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { PropertiesApi } from "~/utils/api/.server/PropertiesApi";
import { PropertyWithDetails, getEntityBySlug, EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { deleteProperty, getProperty, updateProperty, updatePropertyOrder } from "~/utils/db/entities/properties.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import RowHelper from "~/utils/helpers/RowHelper";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";

type LoaderData = {
  entity: EntityWithDetails;
  properties: PropertyWithDetails[];
  allEntities: EntityWithDetails[];
  routes: EntitiesApi.Routes;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity ?? "" });
  if (!entity) {
    return redirect("/admin/entities");
  }
  const data: LoaderData = {
    entity,
    properties: entity.properties,
    allEntities: await getAllEntities({ tenantId: null }),
    routes: EntitiesApi.getNoCodeRoutes({ request, params }),
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
  await verifyUserHasPermission(request, "admin.entities.update");
  const { t } = await getTranslations(request);

  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity ?? "" });
  if (!entity) {
    return redirect("/admin/entities");
  }

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
    await verifyUserHasPermission(request, "admin.entities.delete");
    const id = form.get("id")?.toString() ?? "";
    const existingProperty = await getProperty(id);
    if (!existingProperty) {
      return badRequest({ error: t("shared.notFound") });
    }
    await deleteProperty(id);
    return success({
      properties: (await getEntityBySlug({ tenantId: null, slug: params.entity ?? "" }))?.properties,
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
    await verifyUserHasPermission(request, "admin.entities.create");
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
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const params = useParams();

  const [entity, setEntity] = useState<EntityWithDetails>(data.entity);
  const [fakeItems, setFakeItems] = useState<RowWithDetails[]>([]);
  const [fakeItem, setFakeItem] = useState<RowWithDetails | null>(null);

  useEffect(() => {
    setEntity(data.entity);

    const items: RowWithDetails[] = Array.from({ length: 10 }).map((_, idx) => {
      const item: RowWithDetails = {
        values: data.entity.properties.map((property) => {
          return RowHelper.getFakePropertyValue({ property, t, idx: idx + 1 });
        }),
        folio: idx + 1,
        createdAt: new Date(),
        createdByUser: {
          email: "john.doe@email.com",
          firstName: "John",
          lastName: "Doe",
        },
      } as RowWithDetails;
      return item;
    });
    setFakeItems(items);
    setFakeItem(items[0]);
  }, [data, t]);

  return (
    <div className="space-y-2 2xl:grid 2xl:grid-cols-2 2xl:gap-6 2xl:space-y-0">
      <PropertiesList items={data.properties.filter((f) => f.tenantId === null)} />

      <div className="space-y-2">
        <h2 className="text-lg font-bold">Previews</h2>
        <div className="border-border space-y-2 rounded-lg border-2 border-dashed px-3 pt-3 pb-3">
          {entity.properties.filter((f) => !f.isDefault).length === 0 ? (
            <InfoBanner title="No properties" text="Add some properties to see previews" />
          ) : (
            <div className="space-y-6">
              {fakeItem && (
                <Fragment>
                  <div className="space-y-2">
                    <Section title="Row Title" />
                    <div className="border-border text-foreground bg-background rounded-md border p-3 font-medium">
                      <RowTitle entity={entity} item={fakeItem} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Section title="Form" />
                    <RowForm entity={entity} item={fakeItem} canSubmit={false} allEntities={data.allEntities} routes={data.routes} />
                  </div>
                </Fragment>
              )}

              {EntityViewLayoutTypes.map((layout) => {
                if (layout.value === "board" && !entity.properties.find((f) => f.type === PropertyType.SELECT)) {
                  return null;
                }
                return (
                  <Fragment key={layout.value}>
                    <div className="space-y-2">
                      <Section title={`List - ${layout.name} layout`} />
                      <RowsList view={layout.value} entity={entity} items={fakeItems} routes={data.routes} />
                    </div>
                  </Fragment>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <SlideOverWideEmpty
        title={params.id ? t("shared.edit") : t("shared.new")}
        open={!!outlet}
        onClose={() => {
          navigate(".", { replace: true });
        }}
        className="sm:max-w-lg"
        overflowYScroll={true}
      >
        <div className="-mx-1 -mt-3">
          <div className="space-y-4">{outlet}</div>
        </div>
      </SlideOverWideEmpty>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="border-border w-full border-t"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="text-foreground bg-secondary px-3 text-base leading-6 font-semibold">{title}</span>
      </div>
    </div>
  );
}
