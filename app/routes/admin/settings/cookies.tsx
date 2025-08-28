import { ActionFunction, LoaderFunctionArgs, MetaFunction, useFetcher } from "react-router";
import { useLoaderData, useSubmit } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CookieConsentSettings from "~/components/cookies/CookieConsentSettings";
import CookiesList from "~/components/cookies/CookiesList";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import PreviewIcon from "~/components/ui/icons/PreviewIcon";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import UnderConstruction from "~/components/ui/misc/UnderConstruction";
import OpenModal from "~/components/ui/modals/OpenModal";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { AppConfiguration, getAppConfiguration, getOrCreateAppConfiguration, updateAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import Modal from "~/components/ui/modals/Modal";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import { toast } from "sonner";
export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  appConfiguration: AppConfiguration;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  await verifyUserHasPermission(request, "admin.settings.cookies.view");
  const appConfiguration = await getAppConfiguration({ request });
  const data: LoaderData = {
    title: `${t("settings.admin.cookies.title")} | ${process.env.APP_NAME}`,
    appConfiguration,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.settings.cookies.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "update") {
    await getOrCreateAppConfiguration({ request });
    const settings = await updateAppConfiguration({
      cookiesEnabled: form.get("enabled") === "on" || form.get("enabled") === "true",
    });
    return Response.json({ success: t("shared.updated") });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminSettingsCookies() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();
  const fetcher = useFetcher<{ success?: string; error?: string }>();

  const [canUpdate] = useState(getUserHasPermission(adminData, "admin.settings.cookies.update"));
  const [enabled, setEnabled] = useState(data.appConfiguration.cookies.enabled);

  const [showCookieSettingsModal, setShowCookieSettingsModal] = useState(false);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.success);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  function onChangeEnabled(value: boolean) {
    setEnabled(value);
    const form = new FormData();
    form.set("action", "update");
    form.set("enabled", value.toString());
    fetcher.submit(form, {
      method: "post",
    });
  }

  return (
    <EditPageLayout
      title={<BackButtonWithTitle href="/admin/settings">{t("settings.admin.cookies.title")}</BackButtonWithTitle>}
      buttons={
        <>
          <ButtonSecondary onClick={() => setShowCookieSettingsModal(true)}>
            <PreviewIcon className="h-4 w-4" />
            <div>{t("shared.preview")}</div>
          </ButtonSecondary>
        </>
      }
    >
      <Modal open={showCookieSettingsModal} setOpen={setShowCookieSettingsModal}>
        <CookieConsentSettings onUpdated={() => setShowCookieSettingsModal(false)} />
      </Modal>

      <div>
        <InputCheckboxWithDescription
          name="enabled"
          value={enabled}
          setValue={(e) => onChangeEnabled(Boolean(e))}
          title="Enable cookie consent"
          description="Users need to accept or decline cookies to close the consent banner."
          disabled={!canUpdate}
        />

        {/* <UnderConstruction title="TODO: Cookies (Add used cookies)" /> */}

        <CookiesList editing={true} />
      </div>
    </EditPageLayout>
  );
}
