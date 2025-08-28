import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { forwardRef, Fragment, Ref, useImperativeHandle, useRef, useState } from "react";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import { useEscapeKeypress } from "~/utils/shared/KeypressUtils";
import clsx from "~/utils/shared/ClassesUtils";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import { User } from "@prisma/client";

export interface RefSelectUsers {
  show: (selected: string[]) => void;
}

interface Props {
  items: User[];
  allowSearch?: boolean;
  onClosed?: () => void;
  onSelected: (users: User[]) => void;
}

const SelectUsers = ({ items, allowSearch, onClosed, onSelected }: Props, ref: Ref<RefSelectUsers>) => {
  const { t } = useTranslation();

  const errorModal = useRef<RefErrorModal>(null);

  const [showing, setShowing] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  useImperativeHandle(ref, () => ({ show }));
  function show(_selected: string[]) {
    setSelected(_selected);
    setShowing(true);
  }
  function close() {
    if (onClosed) {
      onClosed();
    }
    setShowing(false);
  }
  function toggle(item: User) {
    if (isSelected(item)) {
      setSelected(selected.filter((f) => f !== item.id));
    } else {
      setSelected((selected) => [...selected, item.id]);
    }
  }
  function isSelected(item: User) {
    return selected.find((f) => f === item.id);
  }
  function accept() {
    const selectedUsers: User[] = [];
    items.forEach((user) => {
      if (isSelected(user)) {
        selectedUsers.push(user);
      }
    });
    if (onSelected) {
      onSelected(selectedUsers);
    }
    close();
  }
  const filteredItems = (items: User[]): User[] => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.id?.toUpperCase().includes(searchInput.toUpperCase()) ||
        f.email?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase())
    );
  };

  useEscapeKeypress(close);

  return (
    <div>
      {showing && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <Transition
              as={Fragment}
              show={showing}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="bg-foreground/90 absolute inset-0 opacity-75"></div>
              </div>
            </Transition>

            <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true"></span>
            <Transition
              as={Fragment}
              show={showing}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                // v-show="showing"
                className="bg-background my-8 inline-block w-full transform overflow-visible rounded-sm px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:max-w-lg sm:p-6 sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className="just absolute right-0 top-0 -mt-4 pr-4">
                  <button
                    onClick={close}
                    type="button"
                    className="border-border hover:text-muted-foreground text-muted-foreground bg-background flex items-center justify-center rounded-full border p-1 hover:bg-gray-200 focus:outline-hidden"
                  >
                    <span className="sr-only">{t("shared.close")}</span>
                    <svg
                      className="text-foreground/80 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="mt-3">
                  <div className="mx-auto max-w-lg">
                    <div>
                      <div className="text-center">
                        <h2 className="text-foreground mt-2 text-lg font-medium">{t("app.users.select")}</h2>
                      </div>
                      {allowSearch && (
                        <form action="#" className="mt-6 flex">
                          <label htmlFor="search" className="sr-only">
                            {t("shared.search")}
                          </label>
                          <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            type="text"
                            name="search"
                            id="search"
                            className="focus:border-theme-500 focus:ring-ring border-border block w-full rounded-md shadow-2xs sm:text-sm"
                            placeholder={t("shared.searchDot")}
                          />
                        </form>
                      )}
                    </div>
                    <div className="mt-5">
                      <h3 className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">{t("models.user.plural")}</h3>
                      {(() => {
                        if (items.length === 0) {
                          return (
                            <div>
                              <EmptyState
                                className="bg-background"
                                captions={{
                                  thereAreNo: t("app.users.empty"),
                                }}
                              />
                            </div>
                          );
                        } else {
                          return (
                            <div>
                              <ul className="border-border divide-border mt-4 divide-y border-b border-t">
                                {filteredItems(items).map((item, idx) => {
                                  return (
                                    <li className="flex items-center justify-between space-x-3 py-2" key={idx}>
                                      <div className="flex min-w-0 flex-1 items-center space-x-3">
                                        <div className="min-w-0 flex-1">
                                          <p className="text-foreground truncate text-sm font-medium">{item.email}</p>
                                          <p className="text-muted-foreground truncate text-sm font-medium">
                                            {item.firstName} {item.lastName}
                                          </p>
                                        </div>
                                      </div>
                                      <div className="shrink-0">
                                        <button
                                          onClick={() => toggle(item)}
                                          type="button"
                                          className={clsx(
                                            "inline-flex items-center rounded-full border border-transparent px-3 py-2 focus:outline-hidden",
                                            !isSelected(item) && "text-foreground bg-secondary/90 hover:bg-teal-200",
                                            isSelected(item) && "bg-teal-100 text-teal-800 hover:bg-red-200 "
                                          )}
                                        >
                                          {/*Heroicon name: solid/plus-sm */}
                                          {(() => {
                                            if (!isSelected(item)) {
                                              return (
                                                <svg
                                                  className="-ml-1 mr-0.5 h-5 w-5"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                  aria-hidden="true"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              );
                                            } else {
                                              return (
                                                <svg
                                                  className="-ml-1 mr-0.5 h-4 w-4"
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  viewBox="0 0 20 20"
                                                  fill="currentColor"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                  />
                                                </svg>
                                              );
                                            }
                                          })()}

                                          {(() => {
                                            if (!isSelected(item)) {
                                              return (
                                                <span className="text-foreground text-sm font-medium">
                                                  {t("shared.add")}
                                                  <span className="sr-only">
                                                    {item.firstName} - {item.lastName}
                                                  </span>
                                                </span>
                                              );
                                            } else {
                                              return (
                                                <span className="text-foreground text-sm font-medium">
                                                  {t("shared.remove")}
                                                  <span className="sr-only">
                                                    {item.firstName} - {item.lastName}
                                                  </span>
                                                </span>
                                              );
                                            }
                                          })()}
                                        </button>
                                      </div>
                                    </li>
                                  );
                                })}
                              </ul>
                              <div className="flex justify-end py-3 text-right">
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={close}
                                    className="hover:bg-secondary focus:ring-ring border-border bg-background text-foreground/80 inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-offset-2"
                                  >
                                    {t("shared.cancel")}
                                  </button>
                                  <button
                                    onClick={accept}
                                    type="submit"
                                    disabled={selected.length === 0}
                                    className={clsx(
                                      "bg-theme-600 hover:bg-theme-700 focus:ring-ring inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-offset-2",
                                      selected.length === 0 && "cursor-not-allowed opacity-50"
                                    )}
                                  >
                                    {t("shared.accept")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
          <ErrorModal ref={errorModal} />
        </div>
      )}
    </div>
  );
};

export default forwardRef(SelectUsers);
