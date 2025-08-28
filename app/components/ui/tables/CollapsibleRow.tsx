import { Menu } from "@headlessui/react";
import clsx from "clsx";
import { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DropdownOptions from "../dropdowns/DropdownOptions";
import OpenCloseArrowIcon from "../icons/OpenCloseArrowIcon";

export interface RefSimpleRow {}

interface Props {
  value: ReactNode;
  title: ReactNode;
  children: ReactNode;
  onRemove?: () => void;
  initial?: boolean;
  className?: string;
  disabled?: boolean;
  draggable?: boolean;
  opened?: boolean;
}

export default function CollapsibleRow({ value, title, children, onRemove, initial = false, className, disabled, draggable, opened }: Props) {
  const { t } = useTranslation();

  const [open, setOpen] = useState(initial);

  useEffect(() => {
    if (opened !== undefined) {
      setOpen(opened);
    }
  }, [opened]);

  return (
    <div
      className={clsx(
        className,
        "border-border bg-background rounded-md border-2 border-dashed p-2",
        draggable && "hover:bg-secondary/90 hover:border-foreground hover:cursor-move hover:border-dashed"
      )}
    >
      <div className="flex items-center justify-between space-x-2">
        <button type="button" onClick={() => setOpen(!open)} className={clsx("w-full truncate text-left text-sm", draggable && "hover:cursor-move")}>
          {!open ? <span className=" text-muted-foreground">{value ?? "Empty"}</span> : <span className=" text-foreground font-medium">{title}</span>}
        </button>
        <div className=" flex shrink-0 items-center space-x-2">
          {onRemove && (
            <DropdownOptions
              options={
                <div>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={onRemove}
                        disabled={disabled}
                        className={clsx(
                          "w-full text-left",
                          active ? "text-foreground bg-secondary/90" : "text-foreground/80",
                          "block px-4 py-2 text-sm",
                          disabled && "cursor-not-allowed"
                        )}
                      >
                        {t("shared.remove")}
                      </button>
                    )}
                  </Menu.Item>
                </div>
              }
            ></DropdownOptions>
          )}
          <OpenCloseArrowIcon open={open} setOpen={setOpen} />
        </div>
      </div>
      {open && <div>{children}</div>}
    </div>
  );
}
