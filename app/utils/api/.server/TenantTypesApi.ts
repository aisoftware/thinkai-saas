import { getDefaultTenantTypes } from "../../db/tenants/tenantTypes.db.server";
import { SubscriptionProductDto } from "~/application/dtos/subscriptions/SubscriptionProductDto";
import { addTenantTypeToTenant, getTenant } from "../../db/tenants.db.server";

export namespace TenantTypesApi {
  export async function setTenantTypes({
    tenantId,
    subscriptionProduct,
    types,
  }: {
    tenantId: string;
    subscriptionProduct?: SubscriptionProductDto;
    types?: string[];
  }) {
    const tenant = await getTenant(tenantId);
    if (!tenant) {
      return;
    }
    if (types) {
      await Promise.all(
        types.map(async (typeId) => {
          await addTenantTypeToTenant(tenant.id, { typeId });
        })
      );
      return;
    }
    const defaultTenantTypes = await getDefaultTenantTypes();
    const allTenantTypes = [...defaultTenantTypes, ...(subscriptionProduct?.assignsTenantTypes ?? [])].filter(
      (v, i, a) => a.findIndex((t) => t.id === v.id) === i
    );
    await Promise.all(
      allTenantTypes.map(async (tenantType) => {
        if (!tenant.types.find((f) => f.id === tenantType.id)) {
          await addTenantTypeToTenant(tenant.id, {
            typeId: tenantType.id,
          });
        }
      })
    );
  }
  // export async function filterEntities({
  //   tenant,
  //   entities,
  //   entityGroups,
  // }: {
  //   tenant: TenantSimple;
  //   entities: EntityWithDetails[];
  //   entityGroups?: EntityGroupWithDetails[];
  // }) {
  //   const tenantTypes = await getAllTenantTypes();
  //   if (tenantTypes.length > 0) {
  //     const tenantEntities = await TenantEntitiesApi.getEntities({ inTypes: tenant.types, enabledOnly: true });
  //     entities = tenantEntities.allEntities;
  //     let newGroups: EntityGroupWithDetails[] = [];
  //     entityGroups?.forEach((group) => {
  //       group.entities = group.entities.filter((f) => entities.some((e) => e.id === f.id));
  //       if (group.entities.length > 0) {
  //         newGroups.push(group);
  //       }
  //     });
  //     entityGroups = newGroups;
  //   }
  // }
}
