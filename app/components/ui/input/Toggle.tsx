import { Switch } from "@headlessui/react";
import clsx from "clsx";

interface Props {
  value: boolean;
  onChange(checked: boolean): void;
  disabled?: boolean;
}
export default function Toggle({ value, onChange, disabled }: Props) {
  return (
    <Switch
      checked={value}
      onChange={onChange}
      disabled={disabled}
      className={clsx(
        value ? "bg-accent-600" : "bg-gray-200",
        "focus:ring-ring relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-offset-2"
      )}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={clsx(
          value ? "translate-x-5" : "translate-x-0",
          "bg-background pointer-events-none inline-block h-5 w-5 transform rounded-full shadow-xs ring-0 transition duration-200 ease-in-out"
        )}
      />
    </Switch>
  );
}
