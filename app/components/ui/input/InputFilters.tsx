import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { FormEvent, Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Form, useSearchParams } from "react-router";
import { Colors } from "~/application/enums/shared/Colors";
import { updateItemByIdx } from "~/utils/shared/ObjectUtils";
import FilterEmptyIcon from "../icons/FilterEmptyIcon";
import FilterFilledIcon from "../icons/FilterFilledIcon";
import InputCheckboxInline from "./InputCheckboxInline";
import InputSearch from "./InputSearch";
import InputSelect from "./InputSelect";
import { Input } from "../input";
import { Button } from "../button";
import { cn } from "~/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdown-menu";

export type FilterDto = {
  name: string;
  title: string;
  options?: { name: string; value: string; color?: Colors }[];
  hideSearch?: boolean;
  isBoolean?: boolean;
  fallbackValue?: string;
};

export type FilterValueDto = FilterDto & {
  selected: boolean;
  value?: string;
};

interface Props {
  filters: FilterDto[];
  withSearch?: boolean;
  withName?: boolean;
  size?: "xs" | "sm" | "default" | "lg";
  position?: "left" | "right";
  // saveEntityFilters?: {
  //   entity: EntityWithDetails;
  //   currentView: EntityView | null;
  //   onSaveFilters: (filters: FilterValueDto[]) => void;
  // };
}

export default function InputFilters({ filters, withSearch = true, size = "default", position = "right" }: Props) {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const [opened, setOpened] = useState(false);
  const [items, setItems] = useState<FilterValueDto[]>([]);
  const [filteredItems, setFilteredItems] = useState<number>(0);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const items: FilterValueDto[] = filters.map((item) => {
      const value = searchParams.get(item.name) ?? undefined;
      return {
        ...item,
        selected: value !== undefined || item.fallbackValue ? true : false,
        value,
      };
    });
    setItems(items);
    setSearchInput(searchParams.get("q") ?? "");
  }, [filters]);

  useEffect(() => {
    const appliedFilters: FilterValueDto[] = [];
    items.forEach((item) => {
      const value = searchParams.get(item.name) ?? item.fallbackValue;
      if (value) {
        appliedFilters.push(item);
      }
    });
    if (withSearch) {
      setFilteredItems(appliedFilters.length + (searchParams.get("q") ? 1 : 0));
    } else {
      setFilteredItems(appliedFilters.length);
    }
  }, [items, searchInput, searchParams, withSearch]);

  // useEffect(() => {
  //     const searchInput = searchParams.get("q");
  //     setSearchInput(searchInput ?? "");

  //     const newItems = items;
  //     items.forEach((item, idx) => {
  //       const valueInParam = searchParams.get(item.name);
  //       if (valueInParam) {
  //         newItems[idx].selected = true;
  //         newItems[idx].value = valueInParam.toString();
  //       } else {
  //         newItems[idx].selected = false;
  //         newItems[idx].value = undefined;
  //       }
  //     });
  //     setItems(newItems);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [searchParams]);

  function onClear() {
    setOpened(false);

    items.forEach((item) => {
      searchParams.delete(item.name);
      item.selected = false;
      item.value = undefined;
    });
    setItems(items);

    searchParams.delete("page");
    searchParams.delete("q");
    setSearchInput("");

    setSearchParams(searchParams);
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    items.forEach((item) => {
      if (item.selected && item.value) {
        searchParams.set(item.name, item.value?.toString() ?? "");
      } else {
        searchParams.delete(item.name);
      }
    });
    if (searchInput) {
      searchParams.set("q", searchInput);
    } else {
      searchParams.delete("q");
    }
    searchParams.delete("page");
    setSearchParams(searchParams);
    setOpened(false);
  }

  // const clickOutside = useOuterClick(() => setOpened(false));

  return (
    <Fragment>
      <Popover open={opened} onOpenChange={setOpened}>
        <PopoverTrigger asChild>
          <Button type="button" size={size} onClick={() => setOpened(!opened)} variant="outline" className="relative z-0 inline-flex gap-2">
            <div className={clsx("relative inline-flex items-center gap-2", filteredItems === 0 ? "rounded-md" : "rounded-l-md")}>
              <div>
                {filteredItems === 0 && <FilterEmptyIcon className="h-3 w-3" />}
                {filteredItems > 0 && <FilterFilledIcon className="h-3 w-3" />}
              </div>
              <div className="hidden sm:block">{t("shared.filters")}</div>
            </div>
            {filteredItems > 0 && (
              <div
                className={clsx(
                  "border-border relative -ml-px inline-flex items-center rounded-full border px-1.5 text-xs font-medium",
                  filteredItems > 0 ? "bg-secondary text-secondary-foreground" : "bg-background text-muted-foreground"
                )}
              >
                {filteredItems}
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Form
            onSubmit={onSubmit}
            method="get"
            className={cn(
              "bg-background divide-border ring-opacity-5 z-40 divide-y rounded-md shadow-2xl ring-1 ring-black focus:outline-none",
              position === "right" ? "right-0" : "left-0"
            )}
          >
            <div className="flex items-center justify-between px-2 py-2 text-sm">
              <Button type="button" variant="outline" onClick={onClear}>
                {t("shared.reset")}
              </Button>
              <div className="font-bold">{t("shared.filters")}</div>
              <Button type="submit" variant="outline">
                {t("shared.apply")}
              </Button>
            </div>
            <div className="bg-background divide-border divide-y rounded-b-md text-sm">
              {withSearch && (
                <div className="p-2">
                  <InputSearch value={searchInput} setValue={setSearchInput} placeholder={t("shared.searchAll") + "..."} />
                </div>
              )}
              {items.map((filter, idx) => {
                return (
                  <div key={filter.name} className="divide-border divide-y">
                    <div className="divide-y divide-gray-300 px-2 py-2">
                      <InputCheckboxInline
                        name={"filter-" + filter.name}
                        title={filter.title.includes(".") ? t(filter.title) : filter.title}
                        value={filter.selected}
                        setValue={(e) => {
                          updateItemByIdx(items, setItems, idx, {
                            selected: Boolean(e),
                          });
                        }}
                      />
                    </div>
                    {filter.selected && (
                      <div className="bg-secondary px-2 py-1">
                        {filter.options && filter.options.length > 0 ? (
                          <div className="flex items-center space-x-2">
                            <InputSelect
                              // withSearch={!filter.hideSearch}
                              name={filter.name}
                              title={""}
                              // withColors={true}
                              placeholder={t("shared.select") + "..."}
                              options={filter.options.map((item) => {
                                return {
                                  value: item.value,
                                  name: item.name && item.name.includes(".") ? t(item.name) : item.name,
                                  color: item.color,
                                };
                              })}
                              value={filter.value ?? filter.fallbackValue}
                              withLabel={false}
                              setValue={(e) => {
                                updateItemByIdx(items, setItems, idx, {
                                  value: e,
                                });
                              }}
                              className="w-full pb-1"
                              selectClassName="bg-background"
                            />
                          </div>
                        ) : filter.isBoolean ? (
                          <div className="flex items-center space-x-2">
                            <InputSelect
                              // withSearch={!filter.hideSearch}
                              name={filter.name}
                              title={""}
                              placeholder={t("shared.select") + "..."}
                              options={[
                                { name: t("shared.yes"), value: "true" },
                                { name: t("shared.no"), value: "false" },
                              ]}
                              value={filter.value ?? filter.fallbackValue ?? ""}
                              withLabel={false}
                              setValue={(e) => {
                                updateItemByIdx(items, setItems, idx, {
                                  value: e,
                                });
                              }}
                              className="bg-background w-full pb-1"
                            />
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <div className="text-muted-foreground flex-shrink-0 truncate">contains</div>
                            <Input
                              type="text"
                              name={filter.name}
                              autoComplete="off"
                              className="focus:border-border focus:ring-ring bg-background border-border block w-full min-w-0 flex-1 rounded-md p-1 text-sm"
                              required
                              value={filter.value ?? filter.fallbackValue ?? ""}
                              onChange={(e) => {
                                updateItemByIdx(items, setItems, idx, {
                                  value: e.currentTarget.value,
                                });
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {/* {saveEntityFilters && (
                <div className="divide-y divide-border">
                  <div className="flex justify-end space-x-2 px-2 py-2">
                    <button
                      type="button"
                      onClick={() => {
                        saveEntityFilters?.onSaveFilters(items.filter((f) => f.value));
                        setOpened(false);
                      }}
                      className={clsx(
                        "rounded-md border border-border  px-2 py-0.5",
                        false
                          ? " bg-secondary/90 text-muted-foreground"
                          : "bg-background text-muted-foreground hover:bg-secondary hover:text-muted-foreground focus:z-10 focus:border-border focus:outline-none focus:ring-1 focus:ring-ring"
                      )}
                    >
                      {saveEntityFilters.currentView ? <div>{t("shared.updateView")}</div> : <div>{t("shared.createView")}</div>}
                    </button>
                  </div>
                </div>
              )} */}
            </div>
          </Form>
        </PopoverContent>
      </Popover>
    </Fragment>
  );
}

// function InputFilters2({ filters, withSearch }: Props) {
//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger>Open</DropdownMenuTrigger>
//       <DropdownMenuContent>
//         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//         <DropdownMenuSeparator />
//         <DropdownMenuItem>Profile</DropdownMenuItem>
//         <DropdownMenuItem>Billing</DropdownMenuItem>
//         <DropdownMenuItem>Team</DropdownMenuItem>
//         <DropdownMenuItem>Subscription</DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }
