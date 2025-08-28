import { Link } from "react-router";
import NumberUtils from "~/utils/shared/NumberUtils";

export default function RowFolioCell({ prefix, folio, href, onClick }: { prefix: string; folio: number; href?: string; onClick?: () => void }) {
  function getText() {
    return `${prefix}-${NumberUtils.pad(folio ?? 0, 4)}`;
  }
  return (
    <>
      {href ? (
        <Link
          to={href}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="hover border-border text-muted-foreground hover:text-foreground bg-secondary rounded-md border border-b px-1 py-0.5 text-center text-sm hover:underline"
        >
          {getText()}
        </Link>
      ) : onClick ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="hover border-border text-muted-foreground hover:text-foreground bg-secondary rounded-md border border-b px-1 py-0.5 text-center text-sm hover:underline"
        >
          {getText()}
        </button>
      ) : (
        <div>{getText()}</div>
      )}
    </>
  );
}
