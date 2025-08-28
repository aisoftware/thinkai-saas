import { useMatches } from "react-router";
import { getTenantUsersCount } from "../db/tenants.db.server";
import { Params } from "react-router";
import { getTenantIdFromUrl } from "../services/.server/urlService";

export type DashboardLoaderData = {
  users: number;
};

export function useDashboardData(): DashboardLoaderData {
  return (useMatches().find((f) => f.id === "routes/app.$tenant/dashboard")?.data ?? {}) as DashboardLoaderData;
}

export async function loadDashboardData({ request, params }: { request: Request; params: Params }): Promise<DashboardLoaderData> {
  const tenantId = await getTenantIdFromUrl(params);
  const data: DashboardLoaderData = {
    users: await getTenantUsersCount(tenantId),
  };
  return data;
}
