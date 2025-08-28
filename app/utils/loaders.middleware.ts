import { getTenantUserType } from "./db/tenants.db.server";
import { getTenantIdFromUrl } from "./services/.server/urlService";
import { getUserInfo } from "./session.server";
import { db } from "./db.server";
import { getUserRoleInTenant } from "./db/permissions/userRoles.db.server";
import { Params } from "react-router";
import { DefaultAppRoles } from "~/application/dtos/shared/DefaultAppRoles";

export async function requireAuth({ request, params }: { request: Request; params: { tenant?: string } }) {
  const userInfo = await getUserInfo(request);
  const currentPath = new URL(request.url).pathname.toLowerCase();
  if (currentPath.startsWith("/admin")) {
    // console.log("[requireAuth.admin]", currentPath);
    return await requireSuperAdmin({ request });
  } else if (currentPath.startsWith("/app") && currentPath !== "/app") {
    // console.log("[requireAuth.app]", currentPath);
    const tenantId = await getTenantIdFromUrl(params);
    if (!userInfo.userId || !tenantId) {
      throw Response.json("Unauthorized", { status: 401 });
    }
    const member = await getTenantUserType(userInfo.userId, tenantId);
    if (!member) {
      const isAdmin = await db.adminUser.findUnique({ where: { userId: userInfo.userId } });
      if (!isAdmin) {
        throw Response.json("Unauthorized", { status: 401 });
      }
    }
  } else {
    // console.log("[requireAuth.none]", currentPath);
  }
  // console.log("member", TenantUserType[member.type]);
  return { ...userInfo };
}

export async function requireSuperAdmin({ request }: { request: Request }) {
  const userInfo = await getUserInfo(request);
  if (!userInfo.userId) {
    throw Response.json("Unauthorized", { status: 401 });
  }
  const isSuperAdmin = await db.adminUser.findUnique({ where: { userId: userInfo.userId } });
  // console.log("isAdmin", isAdmin);
  if (!isSuperAdmin) {
    throw Response.json("Unauthorized", { status: 401 });
  }
  return { ...userInfo, isSuperAdmin };
}

export async function getIsSuperUserOrAdmin({ request, params }: { request: Request; params: Params }) {
  const { userId } = await getUserInfo(request);
  const tenantId = await getTenantIdFromUrl(params);
  if (!userId || !tenantId) return false;

  const isSuperUser = await getUserRoleInTenant(userId, tenantId, DefaultAppRoles.SuperUser);
  if (isSuperUser) return true;

  const isAdmin = await getUserRoleInTenant(userId, tenantId, DefaultAppRoles.Admin);
  if (isAdmin) return true;
  return false;
}
