import { LoaderFunction } from "react-router";
import { Link, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  entities: EntityWithDetails[];
};
export let loader: LoaderFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const data: LoaderData = {
    entities: await getAllEntities({ tenantId: null }),
  };
  return data;
};

export default () => {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <div className="space-y-4 overflow-y-auto p-4 sm:px-8 sm:py-7">
      {data.entities.length === 0 ? (
        <Link
          to="/admin/entities/new"
          className="border-border focus:bg-background hover:border-border relative flex w-full flex-col justify-center space-y-2 rounded-lg border-2 border-dashed p-6 text-center focus:border-2 focus:border-gray-600 focus:outline-hidden"
        >
          <div className="text-foreground block text-sm font-medium">Create entity</div>
        </Link>
      ) : (
        <>
          <div className="text-foreground text-lg font-bold">{t("shared.generate")}</div>
          <div className="grid grid-cols-3 gap-3">
            {data.entities.map((item) => {
              return (
                <Link
                  key={item.name}
                  to={`files/${item.name}`}
                  reloadDocument
                  className="border-border focus:bg-background hover:border-border relative flex w-full flex-col justify-center space-y-2 rounded-lg border-2 border-dashed p-3 text-center focus:border-2 focus:border-gray-600 focus:outline-hidden"
                >
                  <div className="text-foreground block text-sm font-medium">{t(item.titlePlural)}</div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
