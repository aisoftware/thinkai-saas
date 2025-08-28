import { useNavigation, Form } from "react-router";
import clsx from "clsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "~/components/ui/modals/Modal";
import { TenantSimple } from "~/utils/db/tenants.db.server";

export default function DeactivateTenantModal({
  item,
  open,
  onClose,
  onConfirm,
}: {
  item?: TenantSimple;
  open: boolean;
  onClose: () => void;
  onConfirm: (item: TenantSimple, reason: string) => void;
}) {
  const { t } = useTranslation();
  const navigation = useNavigation();

  const [reason, setReason] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!item) {
      return;
    }
    onConfirm(item, reason);
  }
  return (
    <Modal open={open} setOpen={onClose} size="md">
      {!item ? (
        <div></div>
      ) : (
        <Form onSubmit={onSubmit} className="bg-background inline-block w-full overflow-hidden p-1 text-left align-bottom sm:align-middle">
          <div className="mt-3 text-center sm:mt-5">
            <div className="flex items-baseline space-x-1">
              <h3 className="text-foreground text-lg font-medium leading-6">Deactivate:</h3>
              <div className="font-medium">{item.name}</div>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="relative mt-1 rounded-md shadow-2xs">
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                type="text"
                name="reason"
                id="reason"
                required
                className="border-border focus:border-border block w-full rounded-md focus:ring-gray-500 sm:text-sm"
                placeholder={"Reason for deactivation (this will be visible to the user)"}
              />
            </div>
          </div>
          <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              className={clsx(
                "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base  font-medium text-white shadow-2xs  focus:outline-hidden focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm",
                "bg-red-600 hover:bg-red-700 focus:ring-red-500"
              )}
              onClick={() => onConfirm(item, reason)}
            >
              {t("shared.deactivate")}
            </button>
            <button
              type="submit"
              disabled={navigation.state === "submitting"}
              className={clsx(
                "hover:bg-secondary border-border bg-background text-foreground/80 mt-3 inline-flex w-full justify-center rounded-md border px-4 py-2 text-base font-medium shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm",
                navigation.state === "submitting" ? "base-spinner cursor-not-allowed" : ""
              )}
            >
              {t("shared.back")}
            </button>
          </div>
        </Form>
      )}
    </Modal>
  );
}
