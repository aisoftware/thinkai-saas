import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { Input } from "../input";
import { cn } from "~/lib/utils";
import { Button } from "../button";

interface Props {
  size?: "xs" | "sm" | "md";
  onClick: () => void;
  className?: string;
  placeholder?: string;
}

export default function InputSearchButton({ size = "md", onClick, className, placeholder }: Props) {
  const { t } = useTranslation();
  return (
    <div className={clsx("flex justify-between space-x-2")}>
      <div className="relative flex w-full flex-auto items-center justify-center">
        <div className="pointer-events-none absolute inset-y-0 flex items-center justify-center focus-within:z-10 lg:left-0 lg:pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-muted-foreground", size === "xs" && "size-2", size === "sm" && "size-3.5", size === "md" && "size-4")}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <Button
          onClick={onClick}
          // name="search"
          // id="search"
          // className={clsx(
          //   "focus:border-theme-500 focus:ring-ring block w-full rounded-md border-border pl-10 sm:text-sm",
          //   disabled ? "bg-secondary/90 text-muted-foreground" : ""
          // )}
          variant="outline"
          className={cn(
            "text-muted-foreground bg-background focus-visible:border-ring border-input placeholder:text-muted-foreground focus-visible:ring-ring hover:bg-background flex h-9 w-full rounded-md border px-3 py-1 text-left text-sm font-normal shadow-2xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-hidden focus-visible:outline-hidden focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
            className,
            size === "xs" && "h-7 text-xs lg:pl-8",
            size === "sm" && "h-8 text-sm lg:pl-8",
            size === "md" && "lg:pl-9"
            //
          )}
        >
          <span className="hidden text-xs lg:flex">{placeholder ?? t("shared.searchDot")}</span>
        </Button>
      </div>
    </div>
  );
}
