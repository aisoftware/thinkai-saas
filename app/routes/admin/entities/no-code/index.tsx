import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Link } from "react-router";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import NoCodeViewsHelper, { NoCodeEntityViewsDto } from "~/utils/helpers/NoCodeViewsHelper";

type LoaderData = {
  entities: EntityWithDetails[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const data: LoaderData = {
    entities: await getAllEntities({ tenantId: null }),
  };
  return data;
};

export default () => {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const [previews] = useState<NoCodeEntityViewsDto[]>(NoCodeViewsHelper.getBlockPreviews({ t, entities: data.entities }));
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
          {previews.map((item) => {
            return (
              <div key={item.title} className="space-y-2">
                <div>
                  <div className="text-foreground text-lg font-bold">{item.title}</div>
                  <div className="text-muted-foreground text-sm">{item.description}</div>
                </div>
                <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
                  {item.views.map((view) => (
                    <Fragment key={view.name}>
                      {!view.error ? (
                        <Link
                          to={`${view.href}`}
                          reloadDocument={view.reloadDocument}
                          className="border-border focus:bg-background hover:border-border relative flex w-full flex-col justify-center space-y-2 rounded-lg border-2 border-dashed p-3 text-center focus:border-2 focus:border-gray-600 focus:outline-hidden"
                        >
                          {view.icon}
                          <div className="text-foreground block text-sm font-medium">
                            {view.name} {view.error && <span className="text-xs lowercase text-red-500">({view.error})</span>}
                          </div>
                          <div className="text-muted-foreground block text-xs">{view.description}</div>
                          {view.underConstruction && <div className="text-xs lowercase text-orange-500">(Under 🚧 Construction)</div>}
                        </Link>
                      ) : (
                        <div className="relative flex w-full flex-col justify-center space-y-2 rounded-lg border-2 border-dashed border-red-300 bg-red-50 p-3 text-center">
                          {view.icon}
                          <div className="text-foreground block text-sm font-medium">
                            {view.name} {view.error && <span className="text-xs lowercase text-red-500">({view.error})</span>}
                            {view.underConstruction && <span className="text-xs lowercase text-orange-500">(Under 🚧 Construction)</span>}
                          </div>
                          <div className="text-muted-foreground block text-xs">{view.description}</div>
                        </div>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
