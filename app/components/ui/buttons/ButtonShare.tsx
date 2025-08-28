import { Fragment, ReactNode } from "react";
import { Popover, Transition } from "@headlessui/react";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import ShareIcon from "../icons/ShareIcon";

interface Props {
  className?: string;
  disabled?: boolean;
  children: ReactNode;
}
export default function ButtonFlyout({ className, disabled, children }: Props) {
  const { t } = useTranslation();
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            disabled={disabled}
            className={clsx(
              className,
              "border-border focus:border-accent-300 bg-background inline-flex items-center space-x-2 rounded-md border px-3 py-2 text-sm font-medium shadow-2xs focus:outline-hidden focus:ring-2",
              disabled && "cursor-not-allowed opacity-75",
              "text-accent-700",
              !disabled && "hover:border-accent-300 hover:text-accent-900 focus:ring-ring"
            )}
          >
            <span>{t("shared.share")}</span>
            <ShareIcon
              className={clsx(open ? "text-foreground/80" : "text-muted-foreground", "group-hover:text-muted-foreground h-4 w-4")}
              aria-hidden="true"
            />
          </Popover.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
              <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="bg-background relative grid gap-6 px-5 py-6 sm:gap-8 sm:p-8">{children}</div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
