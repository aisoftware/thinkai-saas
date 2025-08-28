import React, { Fragment } from "react";
import InputSelect from "../input/InputSelect";

interface Props {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  possibleCurrencies: string[];
  darkMode?: boolean;
}

export default function CurrencyToggle({ className, value, setValue, possibleCurrencies, darkMode }: Props) {
  // function changeCurrency(currency: string) {
  //   setValue(currency);
  // }
  return (
    <Fragment>
      {possibleCurrencies.length === 1 ? null : (
        <div className={className}>
          <InputSelect
            value={value}
            setValue={(e) => setValue(e?.toString() ?? "")}
            // className={clsx(
            //   "focus:ring-ring focus:border-theme-500 block w-full rounded-md border-border py-2 pl-3 pr-10 text-base text-foreground focus:outline-hidden sm:text-sm",
            //   darkMode && "dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50"
            // )}
            options={possibleCurrencies.map((item) => {
              return {
                value: item,
                name: item.toUpperCase(),
              };
            })}
          />
        </div>
      )}
    </Fragment>
  );
}
