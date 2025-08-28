import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { Input } from "../input";
import clsx from "clsx";
import { cn } from "~/lib/utils";

interface Props {
  onNew?: () => void;
  onNewRoute?: string;
  placeholder?: string;
  size?: "xs" | "sm" | "lg";
  className?: string;
}

export default function InputSearchWithURL({ onNew, onNewRoute, placeholder, size = "lg", className }: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const [search, setSearch] = useState(searchParams.get("q")?.toString() ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q")?.toString() ?? "");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const query = searchParams.get("q") ?? "";
    if (query !== debouncedSearch) {
      searchParams.set("q", debouncedSearch);
      setSearchParams(searchParams, {
        preventScrollReset: true,
      });
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  return (
    <div className={clsx("flex justify-between space-x-2", className)}>
      <div className="relative flex w-full flex-auto items-center">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 focus-within:z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={cn("text-muted-foreground", size === "xs" && "size-2", size === "sm" && "size-3", size === "lg" && "size-4")}
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
        <Input
          type="text"
          // className="focus:border-theme-500 focus:ring-ring block w-full rounded-md border-border pl-9 text-sm"
          className={cn(
            size === "xs" && "h-7 pl-8 text-xs",
            size === "sm" && "h-8 pl-8 text-sm",
            size === "lg" && "pl-9",
            "bg-background"
            //
          )}
          placeholder={placeholder ?? t("shared.searchDot")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoComplete="off"
        />
      </div>

      {onNew && <ButtonPrimary onClick={onNew}>{t("shared.new")}</ButtonPrimary>}
      {onNewRoute && <ButtonPrimary to={onNewRoute}>{t("shared.new")}</ButtonPrimary>}
    </div>
  );
}
