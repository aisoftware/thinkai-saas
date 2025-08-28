/* eslint-disable no-template-curly-in-string */
import CodeGeneratorHelper from "~/modules/codeGenerator/utils/CodeGeneratorHelper";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";

function generate({ entity }: { entity: EntityWithDetails }): string {
  const { capitalized } = CodeGeneratorHelper.getNames(entity);
  let template = `import { Tenant } from "@prisma/client";
import { LoaderFunctionArgs, ActionFunction } from "react-router";
import { RowAccess } from "~/application/enums/entities/RowAccess";
import { getTranslations } from "~/locale/i18next.server";
import { RowPermissionsApi } from "~/utils/api/.server/RowPermissionsApi";
import { getTenant, adminGetAllTenants } from "~/utils/db/tenants.db.server";
import { UserWithDetails, getUsersByTenant } from "~/utils/db/users.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { getUserInfo } from "~/utils/session.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { ${capitalized}Dto } from "../../dtos/${capitalized}Dto";
import { ${capitalized}Service } from "../../services/${capitalized}Service";

export namespace ${capitalized}RoutesShareApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: ${capitalized}Dto;
    tenants: Tenant[];
    users: UserWithDetails[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    const userId = (await getUserInfo(request)).userId;
    const item = await ${capitalized}Service.get(params.id!, {
      tenantId,
      userId,
    });
    if (!item) {
      return Response.json({ error: t("shared.notFound"), status: 404 });
    }
    if (item.row.createdByUserId !== userId) {
      throw Error(t("shared.unauthorized"));
    }
    let tenants: Tenant[] = [];
    if (tenantId) {
      tenants.push((await getTenant(tenantId))!);
    } else {
      tenants = await adminGetAllTenants();
    }
    const data: LoaderData = {
      metatags: [{ title: t("shared.share") + " | " + process.env.APP_NAME }],
      item,
      tenants,
      users: (await getUsersByTenant(tenantId)).filter((f) => f.id !== userId),
    };
    return data;
  };

  export type ActionData = {
    success?: string;
    error?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    const { t } = await getTranslations(request);
    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const tenantId = await getTenantIdOrNull({ request, params });
    const userId = (await getUserInfo(request)).userId;
    const item = await ${capitalized}Service.get(params.id!, {
      tenantId,
      userId,
    });

    if (action === "share") {
      const type = form.get("type")?.toString() as "tenant" | "user" | "role" | "group" | "public";
      const id = form.get("id")?.toString() ?? "";
      const access = form.get("access")?.toString() as RowAccess;
      try {
        await RowPermissionsApi.share(item!.row, {
          type,
          id,
          access,
        });
        return Response.json({ success: t("shared.saved") });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
      }
    } else if (action === "set-access") {
      const id = form.get("id")?.toString() ?? "";
      const access = form.get("access")?.toString() as RowAccess;
      await RowPermissionsApi.setAccess(id, access);
      return Response.json({ success: t("shared.saved") });
    } else if (action === "remove") {
      const id = form.get("id")?.toString() ?? "";
      await RowPermissionsApi.del(id);
      return Response.json({ success: t("shared.deleted") });
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
`;

  return template;
}

export default {
  generate,
};
