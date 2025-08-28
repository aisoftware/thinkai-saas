import clsx from "clsx";
import TableIcon from "../icons/TableIcon";
import ViewBoardsIcon from "../icons/ViewBoardsIcon";

interface Props {
  view: "table" | "board";
  setView: (value: "table" | "board") => void;
}
export default function ViewToggle({ view, setView }: Props) {
  return (
    <span className="relative z-0 inline-flex rounded-md shadow-2xs">
      <button
        onClick={() => setView("table")}
        type="button"
        className={clsx(
          "border-border focus:border-border focus:ring-ring hover:bg-secondary/90 relative inline-flex items-center rounded-l-md border px-4 py-2.5 text-sm font-medium focus:z-10 focus:outline-hidden focus:ring-1",
          view === "table" ? "bg-accent-100 text-accent-500" : "text-muted-foreground bg-background"
        )}
      >
        <TableIcon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setView("board")}
        type="button"
        className={clsx(
          "border-border focus:border-border focus:ring-ring hover:bg-secondary/90 relative -ml-px inline-flex items-center rounded-r-md border px-4 py-2.5 text-sm font-medium focus:z-10 focus:outline-hidden focus:ring-1",
          view === "board" ? "bg-accent-100 text-accent-500" : "text-muted-foreground bg-background"
        )}
      >
        <ViewBoardsIcon className="h-4 w-4" />
      </button>
    </span>
  );
}
