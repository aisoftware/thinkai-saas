import { Params, redirect } from "react-router";
import { DefaultAdminRoles } from "~/application/dtos/shared/DefaultAdminRoles";
import { DefaultAppRoles } from "~/application/dtos/shared/DefaultAppRoles";
import { DefaultEntityTypes } from "~/application/dtos/shared/DefaultEntityTypes";
import { DefaultPermission } from "~/application/dtos/shared/DefaultPermissions";
import { TenantUserType } from "~/application/enums/tenants/TenantUserType";
import { timeFake, TimeFunction } from "~/modules/metrics/services/.server/MetricTracker";
import OnboardingService from "~/modules/onboarding/services/OnboardingService";
import UrlUtils from "~/utils/app/UrlUtils";
import { getAllEntities } from "~/utils/db/entities/entities.db.server";
import { getAllEntityGroups } from "~/utils/db/entities/entityGroups.db.server";
import { getMyGroups } from "~/utils/db/permissions/groups.db.server";
import { getAllRolesWithoutPermissions } from "~/utils/db/permissions/roles.db.server";
import { getPermissionsByUser, getUserRoleInTenant, getUserRoleInAdmin } from "~/utils/db/permissions/userRoles.db.server";
import { getTenantSimple, getMyTenants, getTenantUserType } from "~/utils/db/tenants.db.server";
import { getAllTenantTypes } from "~/utils/db/tenants/tenantTypes.db.server";
import { promiseHash } from "~/utils/promises/promiseHash";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { getActiveTenantSubscriptions, getPlanFeatureUsage } from "~/utils/services/.server/subscriptionService";
import { getUserInfo } from "~/utils/session.server";
import { AppLoaderData } from "../useAppData";
import { getUser } from "~/utils/db/users.db.server";
import { PlanFeatureUsageDto } from "~/application/dtos/subscriptions/PlanFeatureUsageDto";
import { CreditTypes } from "~/modules/usage/dtos/CreditType";
import { DefaultFeatures } from "~/application/dtos/shared/DefaultFeatures";
import { TFunction } from "i18next";

export async function loadAppData({ request, params, t, time = timeFake }: { request: Request; params: Params; t: TFunction; time?: TimeFunction }) {
  const { tenantId, userInfo } = await time(
    promiseHash({
      tenantId: getTenantIdFromUrl(params),
      userInfo: getUserInfo(request),
    }),
    "loadAppData.session"
  );

  const url = new URL(request.url);
  if (UrlUtils.stripTrailingSlash(url.pathname) === UrlUtils.stripTrailingSlash(UrlUtils.currentTenantUrl(params))) {
    throw redirect(UrlUtils.currentTenantUrl(params, "dashboard"));
  }
  const { user, currentTenant } = await time(
    promiseHash({
      user: getUser(userInfo?.userId),
      currentTenant: getTenantSimple(tenantId),
    }),
    "loadAppData.getUserAndTenant"
  );

  const redirectTo = url.pathname + url.search;
  if (!userInfo || !user) {
    let searchParams = new URLSearchParams([["redirect", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  if (!currentTenant) {
    throw redirect(`/app`);
  }
  let { myTenants, mySubscription, allPermissions, superUserRole, superAdminRole, entities, entityGroups, allRoles, myGroups, onboardingSession } = await time(
    promiseHash({
      myTenants: time(getMyTenants(user.id), "loadAppData.getDetails.getMyTenants"),
      mySubscription: time(getActiveTenantSubscriptions(tenantId), "loadAppData.getDetails.getActiveTenantSubscriptions"),
      allPermissions: time(getPermissionsByUser(userInfo.userId, tenantId), "loadAppData.getDetails.getPermissionsByUser"),
      superUserRole: time(getUserRoleInTenant(userInfo.userId, tenantId, DefaultAppRoles.SuperUser), "loadAppData.getDetails.getUserRoleInTenant"),
      superAdminRole: time(getUserRoleInAdmin(userInfo.userId, DefaultAdminRoles.SuperAdmin), "loadAppData.getDetails.getUserRoleInAdmin"),
      entities: time(
        getAllEntities({ tenantId, active: true, types: [DefaultEntityTypes.All, DefaultEntityTypes.AppOnly] }),
        "loadAppData.getDetails.getAllEntities"
      ),
      entityGroups: time(getAllEntityGroups(), "loadAppData.getDetails.getAllEntityGroups()"),
      allRoles: time(getAllRolesWithoutPermissions("app"), "loadAppData.getDetails.getAllRolesWithoutPermissions"),
      myGroups: time(getMyGroups(user.id, currentTenant.id), "loadAppData.getDetails.getMyGroups"),
      onboardingSession: time(
        OnboardingService.getUserActiveOnboarding({ userId: user.id, tenantId: currentTenant.id, request }),
        "loadAppData.getDetails.OnboardingService.getUserActiveOnboarding"
      ),
    }),
    "loadAppData.getDetails"
  );

  const tenantUser = await getTenantUserType(tenantId, userInfo.userId);
  let currentRole = tenantUser?.type ?? TenantUserType.MEMBER;
  if (user.admin) {
    currentRole = TenantUserType.ADMIN;
  }
  const tenantTypes = await getAllTenantTypes();

  let credits: PlanFeatureUsageDto | undefined = undefined;
  if (CreditTypes.length > 0) {
    credits = await getPlanFeatureUsage(tenantId, DefaultFeatures.Credits);
  }
  const data: AppLoaderData = {
    // i18n: i18n.translations,
    user,
    myTenants,
    currentTenant,
    currentRole,
    mySubscription,
    entities,
    entityGroups,
    // roles,
    allRoles,
    permissions: allPermissions.map((f) => f as DefaultPermission),
    myGroups,
    isSuperUser: !!superUserRole,
    isSuperAdmin: !!superAdminRole,
    lng: user?.locale ?? userInfo.lng,
    onboardingSession,
    tenantTypes,
    credits,
  };
  return data;
}
