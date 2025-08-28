import { Link, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { useOuterClick } from "~/utils/shared/KeypressUtils";
import { useAppData } from "~/utils/data/useAppData";
import UrlUtils from "~/utils/app/UrlUtils";
import { EntitySimple } from "~/utils/db/entities/entities.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { useRootData } from "~/utils/data/useRootData";

interface Props {
  entities: EntitySimple[];
  className?: string;
}

export default function QuickActionsButton({ entities, className }: Props) {
  const { t } = useTranslation();
  const params = useParams();
  const appData = useAppData();
  const rootData = useRootData();

  const [opened, setOpened] = useState(false);

  const clickOutside = useOuterClick(() => setOpened(false));
  return (
    <span className={className} ref={clickOutside}>
      {appData.currentRole < 3 && (
        <div className="relative">
          <div className="inline-flex divide-x divide-gray-300 rounded-sm shadow-none">
            <div className="relative z-0 inline-flex rounded-full text-sm shadow-none">
              <button
                onClick={() => setOpened(!opened)}
                type="button"
                className="text-muted-foreground bg-secondary hover:bg-secondary/90 border-border relative inline-flex items-center rounded-full border p-2 font-medium shadow-inner focus:z-10 focus:outline-hidden focus:ring-2 focus:ring-offset-2"
                aria-haspopup="listbox"
                aria-expanded="true"
                aria-labelledby="listbox-label"
              >
                <span className="sr-only">{t("shared.new")}</span>
                {/*Heroicon name: solid/chevron-down */}
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <Transition
            as={Fragment}
            show={opened}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <ul
              className="divide-border bg-background absolute right-0 z-40 mt-2 w-72 origin-top-right divide-y overflow-hidden rounded-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-hidden"
              tabIndex={-1}
              aria-labelledby="listbox-label"
            >
              {rootData.appConfiguration.portals?.enabled && rootData.appConfiguration.portals.forTenants && (
                <>
                  <li className="text-foreground relative cursor-default select-none text-sm" id="listbox-option-2">
                    <Link
                      to={UrlUtils.currentTenantUrl(params, "portals/new")}
                      onClick={() => setOpened(false)}
                      className="hover:bg-secondary flex w-full flex-col p-4 text-left focus:outline-hidden"
                    >
                      <div className="flex justify-between">
                        <p className="font-semibold">{t("models.portal.actions.new.title")}</p>
                      </div>
                      <p className="text-muted-foreground mt-2">{t("models.portal.actions.new.description")}</p>
                    </Link>
                  </li>
                </>
              )}
              {entities.map((entity) => {
                return (
                  <li key={entity.name} className="text-foreground relative cursor-default select-none text-sm" id="listbox-option-0">
                    <Link
                      to={UrlUtils.currentTenantUrl(params, entity.slug + "/new")}
                      onClick={() => setOpened(false)}
                      className="hover:bg-secondary flex flex-col p-4"
                    >
                      <div className="flex justify-between">
                        <p className="font-semibold">
                          {t("shared.new")} {t(entity.title)}
                        </p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Transition>
        </div>
      )}
    </span>
  );
}
