import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Link } from "react-router";
import EntityViewsTable from "~/components/entities/views/EntityViewsTable";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import { EntityWithDetails, getEntityBySlug } from "~/utils/db/entities/entities.db.server";
import { EntityViewWithTenantAndUser, getAllEntityViews } from "~/utils/db/entities/entityViews.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  entity: EntityWithDetails;
  items: EntityViewWithTenantAndUser[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity! });
  const { items } = await getAllEntityViews({
    entityId: entity.id,
    pagination: { pageSize: 1000, page: 1 },
  });

  const data: LoaderData = {
    entity,
    items,
  };
  return data;
};

export default function EditEntityIndexRoute() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="space-y-3">
      <h3 className="text-foreground text-sm font-medium leading-3">Views</h3>
      <div>
        <div className="space-y-2">
          <EntityViewsTable
            items={data.items}
            onClickRoute={(i) => {
              return `/admin/entities/views/${i.id}`;
            }}
          />

          <Link
            to={`/admin/entities/views/new/${data.entity.name}`}
            className="focus:ring-ring border-border hover:border-border relative block w-full rounded-lg border-2 border-dashed p-4 text-center focus:outline-hidden focus:ring-2 focus:ring-offset-2"
          >
            <PlusIcon className="text-muted-foreground mx-auto h-5" />
            <span className="text-foreground mt-2 block text-sm font-medium">Add custom view</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
