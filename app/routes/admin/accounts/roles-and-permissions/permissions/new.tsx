import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import PermissionForm from "~/components/core/roles/PermissionForm";
import { getTranslations } from "~/locale/i18next.server";
import { createAdminLog } from "~/utils/db/logs.db.server";
import { createPermission, getNextPermissionsOrder, getPermissionName } from "~/utils/db/permissions/permissions.db.server";
import { setPermissionRoles } from "~/utils/db/permissions/rolePermissions.db.server";
import { getAllRoles, RoleWithPermissions } from "~/utils/db/permissions/roles.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  title: string;
  roles: RoleWithPermissions[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.create");
  const { t } = await getTranslations(request);

  const roles = await getAllRoles();
  const data: LoaderData = {
    title: `${t("models.permission.object")} | ${process.env.APP_NAME}`,
    roles,
  };
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.roles.create");
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  if (action === "create") {
    const name = form.get("name")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const type: "admin" | "app" = form.get("type")?.toString() === "admin" ? "admin" : "app";
    const roles = form.getAll("roles[]").map((f) => f.toString());

    const existing = await getPermissionName(name);
    if (existing) {
      return badRequest({ error: "Existing permission with name: " + name });
    }

    const order = await getNextPermissionsOrder(type);
    const data = {
      order,
      name,
      description,
      type,
      isDefault: false,
      entityId: null,
    };
    const permission = await createPermission(data);
    await setPermissionRoles(permission.id, roles);
    createAdminLog(
      request,
      "Created",
      `${JSON.stringify({
        ...data,
        roles,
      })}`
    );
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
  return redirect("/admin/accounts/roles-and-permissions/permissions");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminEditPermissionRoute() {
  const data = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  function goBack() {
    navigate("/admin/accounts/roles-and-permissions/permissions");
  }
  return <PermissionForm roles={data.roles} onCancel={goBack} />;
}
