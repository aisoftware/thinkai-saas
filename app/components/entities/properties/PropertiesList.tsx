import { Property } from "@prisma/client";
import clsx from "clsx";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useSubmit } from "react-router";
import { PropertyType } from "~/application/enums/entities/PropertyType";
import { PropertyWithDetails } from "~/utils/db/entities/entities.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import ButtonTertiary from "../../ui/buttons/ButtonTertiary";
import LockClosedIcon from "../../ui/icons/LockClosedIcon";
import NewFieldIcon from "../../ui/icons/NewFieldIcon";
import PencilIcon from "../../ui/icons/PencilIcon";
import TrashIcon from "../../ui/icons/TrashIcon";
import ConfirmModal, { RefConfirmModal } from "../../ui/modals/ConfirmModal";
import PropertyBadge from "./PropertyBadge";
import OrderListButtons from "../../ui/sort/OrderListButtons";
import { defaultDisplayProperties } from "~/utils/helpers/PropertyHelper";
import EyeIcon from "~/components/ui/icons/EyeIcon";
import EyeLashIcon from "~/components/ui/icons/EyeLashIcon";
import DocumentDuplicateIconFilled from "~/components/ui/icons/DocumentDuplicateIconFilled";

interface Props {
  items: PropertyWithDetails[];
  className?: string;
}

export default function PropertiesList({ items, className }: Props) {
  const { t } = useTranslation();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  const [showDefaultFields, setShowDefaultFields] = useState(false);

  function deleteField(item: Property) {
    confirmDelete.current?.setValue(item);
    confirmDelete.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }

  function confirmedDelete(item: Property) {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }
  function onToggleDisplay(item: Property) {
    const form = new FormData();
    form.set("action", "toggle-display");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }
  function onDuplicate(item: Property) {
    const form = new FormData();
    form.set("action", "duplicate");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }

  return (
    <div className={clsx(className, "")}>
      <div className="space-y-2">
        {showDefaultFields && (
          <div className="mb-3 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">{t("models.property.defaultProperties.title")}</h3>
              {showDefaultFields && (
                <div className="flex justify-end">
                  <ButtonTertiary className="-my-1" onClick={() => setShowDefaultFields(!showDefaultFields)}>
                    {t("models.property.defaultProperties.hide")}
                  </ButtonTertiary>
                </div>
              )}
            </div>
            {defaultDisplayProperties.map((item, idx) => {
              return (
                <div key={idx} className="border-border bg-secondary/90 rounded-md border px-4 py-2 shadow-2xs">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <LockClosedIcon className="h-4 w-4 text-gray-300" />
                          {/* <PropertyBadge className="h-4 w-4 text-muted-foreground" /> */}
                          {/* <div className="truncate text-sm text-muted-foreground">{t("entities.fields." + PropertyType[item.type])}</div> */}
                        </div>

                        <div className="text-muted-foreground text-sm">
                          {/* <PropertyTitle item={item} /> */}
                          <div className="flex flex-col">
                            <div>{t(item.title)}</div>
                            <div className="text-muted-foreground text-xs">{item.name}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">{t("models.property.plural")}</h3>
            {!showDefaultFields && (
              <div className="flex justify-end">
                <ButtonTertiary className="-my-1" onClick={() => setShowDefaultFields(!showDefaultFields)}>
                  {t("models.property.defaultProperties.show")}
                </ButtonTertiary>
              </div>
            )}
          </div>

          {items
            .filter((f) => !f.isDefault)
            .sort((a, b) => a.order - b.order)
            .map((item, idx) => {
              return (
                <div key={idx} className="border-border bg-background rounded-md border px-4 py-1 shadow-2xs">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2 truncate">
                      <div className="flex items-center space-x-3 truncate">
                        <div className="hidden shrink-0 sm:flex">
                          <OrderListButtons index={idx} items={items.filter((f) => !f.isDefault)} editable={true} />
                        </div>
                        <div className="flex items-center space-x-2">
                          <PropertyBadge type={item.type} className="text-muted-foreground h-4 w-4" />
                        </div>
                        <div className="text-foreground flex items-center space-x-2 truncate text-sm">
                          <PropertyTitle item={item} />
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 space-x-1">
                      <div className="flex items-center space-x-1 truncate p-1">
                        <button
                          type="button"
                          onClick={() => onToggleDisplay(item)}
                          className="hover:bg-secondary/90 focus:bg-secondary/90 group flex items-center rounded-md border border-transparent p-2 focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 focus:outline-hidden"
                        >
                          {item.isDisplay ? (
                            <EyeIcon className="text-muted-foreground hover:text-muted-foreground h-4 w-4" />
                          ) : (
                            <EyeLashIcon className="hover:text-muted-foreground h-4 w-4 text-gray-300" />
                          )}
                        </button>
                        <Link
                          to={item.id}
                          className="hover:bg-secondary/90 focus:bg-secondary/90 group flex items-center rounded-md border border-transparent p-2 focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 focus:outline-hidden"
                          preventScrollReset
                          // onClick={() => update(idx, item)}
                        >
                          <PencilIcon className="group-hover:text-muted-foreground h-4 w-4 text-gray-300" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onDuplicate(item)}
                          className="hover:bg-secondary/90 focus:bg-secondary/90 group flex items-center rounded-md border border-transparent p-2 focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 focus:outline-hidden"
                        >
                          <DocumentDuplicateIconFilled className="hover:text-muted-foreground h-4 w-4 text-gray-300" />
                        </button>
                        <button
                          type="button"
                          className="hover:bg-secondary/90 focus:bg-secondary/90 group flex items-center rounded-md border border-transparent p-2 focus:ring-2 focus:ring-gray-400 focus:ring-offset-1 focus:outline-hidden"
                          onClick={() => deleteField(item)}
                        >
                          <TrashIcon className="group-hover:text-muted-foreground h-4 w-4 text-gray-300" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className="mt-3">
        <Link
          to={`new`}
          className="focus:ring-ring border-border hover:border-border relative block w-full rounded-lg border-2 border-dashed px-12 py-6 text-center focus:ring-2 focus:ring-offset-2 focus:outline-hidden"
          preventScrollReset
        >
          <NewFieldIcon className="text-muted-foreground mx-auto h-8" />
          <span className="text-foreground mt-2 block text-sm font-medium">{t("models.property.actions.add")}</span>
        </Link>
      </div>
      {/* <PropertyForm ref={propertyForm} entityId={entityId} onCreated={created} onUpdated={updated} onDeleted={deleted} /> */}
      <ConfirmModal ref={confirmDelete} destructive onYes={confirmedDelete} />
    </div>
  );
}

const PropertyTitle = ({ item }: { item: PropertyWithDetails }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex items-baseline space-x-1 truncate">
        <div className="flex flex-col">
          <div>
            {t(EntityHelper.getFieldTitle(item, item.isDefault))}
            {item.isRequired && <span className="text-red-500">*</span>}
          </div>
          <div className="text-muted-foreground text-xs">
            {item.name}
            {item.subtype === "phone" && " (phone)"}
            {item.subtype === "url" && " (URL)"}
            {[PropertyType.MULTI_SELECT, PropertyType.SELECT].includes(item.type) && "[]"}
            {[PropertyType.RANGE_NUMBER, PropertyType.RANGE_DATE].includes(item.type) && " (range)"}
            {[PropertyType.FORMULA].includes(item.type) && ` (formula)`}
          </div>
        </div>
        {/* {item.type === PropertyType.FORMULA && <div className="truncate italic text-muted-foreground">({item.formula})</div>} */}
        {[PropertyType.SELECT, PropertyType.MULTI_SELECT].includes(item.type) && (
          <div className="text-muted-foreground truncate text-xs">
            [{item.options.length === 0 ? "No options" : "Options: " + item.options?.map((f) => f.value).join(", ")}]
          </div>
        )}

        {item.attributes.filter((f) => f.value).length > 0 && (
          <div className="text-muted-foreground truncate text-xs">
            [
            {item.attributes
              .filter((f) => f.value)
              .map((f) => `${f.name}: ${f.value}`)
              .join(", ")}
            ]
          </div>
        )}
      </div>
    </>
  );
};
