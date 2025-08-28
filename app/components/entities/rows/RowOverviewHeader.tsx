import { Fragment, ReactNode, useRef } from "react";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import TrashEmptyIcon from "~/components/ui/icons/TrashEmptyIcon";
import EntityHelper from "~/utils/helpers/EntityHelper";
import RowTitle from "./RowTitle";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { useNavigation, useSubmit } from "react-router";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { getUserHasPermission, getEntityPermission } from "~/utils/helpers/PermissionsHelper";
import ShareIcon from "~/components/ui/icons/ShareIcon";
import PencilIcon from "~/components/ui/icons/PencilIcon";
import RunPromptFlowButtons from "~/modules/promptBuilder/components/run/RunPromptFlowButtons";
import clsx from "clsx";
import { useTranslation } from "react-i18next";

export default function RowOverviewHeader({
  rowData,
  item,
  canUpdate,
  isEditing,
  routes,
  title,
  options,
  buttons,
  customActions,
  truncate = true,
}: {
  rowData: RowsApi.GetRowData;
  item: RowWithDetails;
  canUpdate: boolean;
  isEditing: boolean;
  routes: EntitiesApi.Routes | undefined;
  title?: React.ReactNode;
  options?: {
    hideTitle?: boolean;
    hideMenu?: boolean;
    hideShare?: boolean;
    hideTags?: boolean;
    hideTasks?: boolean;
    hideActivity?: boolean;
    disableUpdate?: boolean;
    disableDelete?: boolean;
  };
  buttons?: ReactNode;
  customActions?: { entity: string; label: string; action: string }[];
  truncate?: boolean;
}) {
  const { t } = useTranslation();
  const appOrAdminData = useAppOrAdminData();
  const navigation = useNavigation();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  function getEditRoute() {
    if (isEditing) {
      return EntityHelper.getRoutes({ routes, entity: rowData.entity, item })?.overview;
    } else {
      return EntityHelper.getRoutes({ routes, entity: rowData.entity, item })?.edit;
    }
  }
  function canDelete() {
    return !options?.disableDelete && getUserHasPermission(appOrAdminData, getEntityPermission(rowData.entity, "delete")) && rowData.rowPermissions.canDelete;
  }

  function onDelete() {
    confirmDelete.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function onDeleteConfirm() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }

  return (
    <div className="border-border relative items-center justify-between space-y-2 border-b pb-4 sm:flex sm:space-x-4 sm:space-y-0">
      <div className={clsx(truncate && "truncate", "flex flex-col")}>
        <div className={clsx(truncate && "truncate", "flex items-center space-x-2 text-xl font-bold")}>
          {title ?? <RowTitle entity={rowData.entity} item={item} />}
        </div>
      </div>

      <div className="flex shrink-0 items-center space-x-2 sm:justify-end">
        <div className="flex items-end space-x-2 space-y-0">
          {canUpdate || item.createdByUserId === appOrAdminData?.user?.id || appOrAdminData?.isSuperUser ? (
            <Fragment>
              {customActions
                ?.filter((f) => f.entity === rowData.entity.name)
                .map((customAction) => {
                  return (
                    <ButtonSecondary
                      key={customAction.action}
                      isLoading={navigation.state === "submitting" && navigation.formData?.get("action") === customAction.action}
                      onClick={() => {
                        const form = new FormData();
                        form.set("action", customAction.action);
                        form.set("id", item.id);
                        submit(form, {
                          method: "post",
                        });
                      }}
                    >
                      <span className="text-xs">{customAction.label}</span>
                    </ButtonSecondary>
                  );
                })}
              {buttons}
              {!options?.hideShare && (item.createdByUserId === appOrAdminData?.user?.id || appOrAdminData.isSuperAdmin) && (
                <ButtonSecondary to="share">
                  <ShareIcon className="text-muted-foreground h-4 w-4" />
                </ButtonSecondary>
              )}
              {rowData.entity.onEdit !== "overviewAlwaysEditable" && (
                <ButtonSecondary disabled={!EntityHelper.getRoutes({ routes, entity: rowData.entity, item })?.edit} to={getEditRoute()}>
                  <PencilIcon className="text-muted-foreground h-4 w-4" />
                </ButtonSecondary>
              )}
              {isEditing && (
                <ButtonSecondary onClick={onDelete} disabled={!canDelete()}>
                  <TrashEmptyIcon className="text-muted-foreground h-4 w-4" />
                </ButtonSecondary>
              )}
              <RunPromptFlowButtons type="edit" row={item} promptFlows={rowData.promptFlows} />
            </Fragment>
          ) : appOrAdminData.isSuperAdmin ? (
            <ButtonSecondary to="share">
              <ShareIcon className="text-muted-foreground h-4 w-4" />
            </ButtonSecondary>
          ) : null}
        </div>
      </div>

      <ConfirmModal ref={confirmDelete} destructive onYes={onDeleteConfirm} />
    </div>
  );
}
