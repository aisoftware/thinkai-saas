import { useLocation, useMatches, useSearchParams, useSubmit } from "react-router";
import { useRootData } from "~/utils/data/useRootData";
import AnalyticsHelper from "~/utils/helpers/AnalyticsHelper";
import { Button } from "../button";
import { cn } from "~/lib/utils";
import { Fragment } from "react/jsx-runtime";

interface Props {
  className?: string;
  disabled?: boolean;
}
export default function DarkModeToggle({ className, disabled }: Props) {
  const { userSession } = useRootData();
  let location = useLocation();
  const [searchParams] = useSearchParams();
  const submit = useSubmit();
  const rootData = useRootData();
  const matches = useMatches();

  const toggle = async () => {
    const form = new FormData();
    form.set("action", "toggleLightOrDarkMode");
    form.set("redirect", location.pathname + "?" + searchParams.toString());
    submit(form, { method: "post", action: "/", preventScrollReset: true });

    const routeMatch = matches.find((m) => m.pathname == location.pathname);
    const isDarkMode = userSession?.lightOrDarkMode === "dark";
    AnalyticsHelper.addEvent({
      url: location.pathname,
      route: routeMatch?.id,
      rootData,
      action: "toggleLightOrDarkMode",
      category: "user",
      label: "lightOrDarkMode",
      value: isDarkMode ? "light" : "dark",
    });
  };

  return (
    <Button
      variant="ghost"
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={cn("flex w-10 space-x-2", className)}
      // className={clsx(
      //   className,
      //   "inline-flex items-center justify-center rounded-md px-2 py-1 font-medium text-muted-foreground hover:bg-secondary/90 hover:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-gray-500 dark:hover:bg-gray-600 dark:hover:text-gray-300",
      //   width
      // )}
    >
      <DarkModeSvgs />
    </Button>
  );
}

export function DarkModeSvgs({ className, withLabel, filled }: { className?: string; withLabel?: boolean; filled?: boolean }) {
  const { userSession } = useRootData();
  const isDarkMode = userSession?.lightOrDarkMode === "dark";

  return (
    <div className="flex items-center gap-2">
      {!isDarkMode ? (
        <Fragment>
          {!filled ? (
            <svg
              className={cn("text-muted-foreground size-5", className)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("text-muted-foreground size-5", className)}>
              <path
                fillRule="evenodd"
                d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </Fragment>
      ) : (
        <Fragment>
          {!filled ? (
            <svg
              className={cn("text-muted-foreground size-5", className)}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
              />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("text-muted-foreground size-5", className)}>
              <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
            </svg>
          )}
        </Fragment>
      )}

      {withLabel && <span>{isDarkMode ? "Light" : "Dark"} Mode</span>}
    </div>
  );
}
