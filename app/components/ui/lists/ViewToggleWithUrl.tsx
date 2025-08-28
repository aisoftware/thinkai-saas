import clsx from "clsx";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import TableIcon from "../icons/TableIcon";
import ViewBoardsIcon from "../icons/ViewBoardsIcon";

interface Props {
  defaultView?: "table" | "board";
  className?: string;
}
export default function ViewToggleWithUrl({ defaultView, className }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState(searchParams.get("view") ?? defaultView ?? "table");

  useEffect(() => {
    const view = searchParams.get("view");
    if (view) {
      setView(view);
    }
  }, [searchParams]);

  // useEffect(() => {
  //   searchParams.set("view", view);
  //   setSearchParams(searchParams);
  // }, [view]);

  function onChange(value: "table" | "board") {
    searchParams.set("view", value);
    setSearchParams(searchParams);
  }
  return (
    <span className={clsx("relative z-0 inline-flex rounded-md shadow-2xs", className)}>
      <button
        onClick={() => onChange("table")}
        type="button"
        className={clsx(
          "border-border focus:border-border focus:ring-ring hover:bg-secondary/90 relative inline-flex items-center rounded-l-md border px-4 py-2.5 font-medium focus:z-10 focus:outline-hidden focus:ring-1 sm:text-sm",
          view === "table" ? "bg-accent-100 text-accent-500" : "bg-background text-foreground/80"
        )}
      >
        <TableIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => onChange("board")}
        type="button"
        className={clsx(
          "border-border focus:border-border focus:ring-ring hover:bg-secondary/90 relative -ml-px inline-flex items-center rounded-r-md border px-4 py-2.5 text-sm font-medium focus:z-10 focus:outline-hidden focus:ring-1",
          view === "board" ? "bg-accent-100 text-accent-500" : "bg-background text-foreground/80"
        )}
      >
        <ViewBoardsIcon className="h-4 w-4" />
      </button>
    </span>
  );
}
