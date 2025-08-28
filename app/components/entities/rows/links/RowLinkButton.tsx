import { Link, useParams } from "react-router";
import { ExternalLinkIcon } from "lucide-react";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import EntityHelper from "~/utils/helpers/EntityHelper";

export default function RowLinkButton({ entityName, id }: { entityName: string; id: string }) {
  const appOrAdminData = useAppOrAdminData();
  const params = useParams();
  const entity = appOrAdminData.entities.find((f) => f.name === entityName)!;
  return (
    <Link
      onClick={(e) => e.stopPropagation()}
      to={`${EntityHelper.getEntityRoute({ entity, params, appOrAdminData })}/${id}`}
      className="border-border bg-background hover:border-border absolute right-2 top-2 z-10 hidden rounded-md border p-2 opacity-80 hover:opacity-100 group-hover:block"
    >
      <ExternalLinkIcon className="text-foreground/80 h-4 w-4" />
    </Link>
  );
}
