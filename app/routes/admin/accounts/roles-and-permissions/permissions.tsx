import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData, useNavigate, useOutlet, useParams } from "react-router";
import { Outlet } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getAllPermissions, PermissionWithRoles, updatePermission } from "~/utils/db/permissions/permissions.db.server";
import PermissionsTable from "~/components/core/roles/PermissionsTable";
import { useAdminData } from "~/utils/data/useAdminData";
import { getFiltersFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { getAllRolesNames } from "~/utils/db/permissions/roles.db.server";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import InputSearchWithURL from "~/components/ui/input/InputSearchWithURL";
import InputFilters from "~/components/ui/input/InputFilters";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { t } from "i18next";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  items: PermissionWithRoles[];
  filterableProperties: FilterablePropertyDto[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.view");
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.roles-and-permissions.permissions");
  let { t } = await getTranslations(request);

  const filterableProperties: FilterablePropertyDto[] = [
    { name: "name", title: "models.role.name" },
    { name: "description", title: "models.role.description" },
    {
      name: "roleId",
      title: "models.role.object",
      manual: true,
      options: (await time(getAllRolesNames(), "getAllRolesNames")).map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      }),
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const items = await time(getAllPermissions(undefined, filters), "getAllPermissions");

  const data: LoaderData = {
    title: `${t("models.permission.plural")} | ${process.env.APP_NAME}`,
    items,
    filterableProperties,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

type ActionData = {
  items?: PermissionWithRoles[];
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "set-orders") {
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updatePermission(id, { order: Number(order) });
      })
    );
    return Response.json({ items: await getAllPermissions() });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const actionData = useLoaderData<ActionData>();
  const adminData = useAdminData();
  const navigate = useNavigate();
  const outlet = useOutlet();
  const params = useParams();

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="grow">
          <InputSearchWithURL />
        </div>
        <InputFilters filters={data.filterableProperties} />
        <ButtonPrimary to="new">
          <div className="sm:text-sm">+</div>
        </ButtonPrimary>
      </div>
      <PermissionsTable
        // canReorder={true}
        items={actionData?.items ?? data.items}
        canCreate={getUserHasPermission(adminData, "admin.roles.create")}
        canUpdate={getUserHasPermission(adminData, "admin.roles.update")}
      />

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
