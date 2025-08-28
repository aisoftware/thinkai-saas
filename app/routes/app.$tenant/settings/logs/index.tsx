import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import LogsTable from "~/components/app/events/LogsTable";
import InputFilters from "~/components/ui/input/InputFilters";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import UrlUtils from "~/utils/app/UrlUtils";
import { getLogs, LogWithDetails } from "~/utils/db/logs.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import Tabs from "~/components/ui/tabs/Tabs";

type LoaderData = {
  items: LogWithDetails[];
  pagination: PaginationDto;
  filterableProperties: FilterablePropertyDto[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "app.settings.auditTrails.view", tenantId);

  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "action",
      title: "models.log.action",
    },
    {
      name: "url",
      title: "models.log.url",
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await getLogs(tenantId, currentPagination, filters);

  const data: LoaderData = {
    items,
    pagination,
    filterableProperties,
  };
  return data;
};

export default function Events() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  return (
    <EditPageLayout
    // title={t("models.log.plural")}
    >
      <div className="flex justify-between gap-2">
        <Tabs
          tabs={[
            {
              name: t("models.log.plural"),
              routePath: UrlUtils.getModulePath(params, "logs"),
            },
            {
              name: t("models.event.plural"),
              routePath: UrlUtils.getModulePath(params, "logs/events"),
            },
          ]}
          className="grow"
        />

        <InputFilters size="sm" filters={data.filterableProperties} />
      </div>
      <LogsTable withTenant={false} items={data.items} pagination={data.pagination} />
    </EditPageLayout>
  );
}
