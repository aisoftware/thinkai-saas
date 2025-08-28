import { useFetcher, useSearchParams } from "react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import Kanban from "~/components/ui/lists/Kanban";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import RowHelper from "~/utils/helpers/RowHelper";

// type EntityWithRows = {
//   entity: EntityWithDetails;
//   rows: RowWithDetails[];
// };
export default function RowsRelationships({ entities }: { entities: string[] }) {
  return (
    <div className="flex overflow-hidden overflow-x-auto">
      {entities.map((entity) => (
        <EntityRowsRelationships className="w-full" key={entity} entity={entity} />
      ))}
    </div>
  );
}

function EntityRowsRelationships({ entity, className, withTitle }: { entity: string; className?: string; withTitle?: boolean }) {
  const { t } = useTranslation();
  const fetcher = useFetcher<{ entity: EntityWithDetails; items: RowWithDetails[] }>();
  const [data, setData] = useState<{ entity: EntityWithDetails; items: RowWithDetails[] }>();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetcher.load(`/api/v2/entities/${entity}/rows?` + searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity, searchParams]);

  useEffect(() => {
    setData(fetcher.data);
  }, [fetcher.data]);

  function isSelected(item: RowWithDetails) {
    return searchParams.getAll(`${entity}[id]`).includes(item.id);
  }
  return (
    <div className={clsx(className)}>
      {data?.entity && (
        <Kanban
          withTitle={withTitle}
          columns={[
            {
              name: "entity",
              title: t(data?.entity.titlePlural ?? ""),
              items: data?.items ?? [],
              card: (item) => (
                <div className="hover:bg-secondary border-border bg-background group w-full truncate rounded-md border p-3 text-left shadow-2xs">
                  <div className="flex items-center justify-between space-x-2">
                    <button
                      className="grow truncate text-left"
                      type="button"
                      onClick={() => {
                        if (isSelected(item)) {
                          const rows = searchParams.getAll(`${entity}[id]`).filter((id) => id !== item.id);
                          searchParams.delete(`${entity}[id]`);
                          for (const row of rows) searchParams.append(`${entity}[id]`, row);
                        } else {
                          searchParams.append(`${entity}[id]`, item.id);
                        }
                        setSearchParams(searchParams);
                      }}
                    >
                      <div>{RowHelper.getTextDescription({ entity: data.entity!, item, t })}</div>
                    </button>
                    <div className="w-4 shrink-0">{isSelected(item) ? <CheckIcon className="text-muted-foreground h-4 w-4" /> : null}</div>
                    {/* <button type="button" onClick={() => alert("edit: " + item.id)}>
                      Edit
                    </button> */}
                  </div>
                </div>
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
