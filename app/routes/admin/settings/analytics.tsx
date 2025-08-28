import { ActionFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, useLoaderData } from "react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import InputText from "~/components/ui/input/InputText";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { AppConfiguration, getAppConfiguration, getOrCreateAppConfiguration, updateAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import SettingSection from "~/components/ui/sections/SettingSection";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  appConfiguration: AppConfiguration;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  await verifyUserHasPermission(request, "admin.settings.analytics.view");
  const appConfiguration = await getAppConfiguration({ request });
  const data: LoaderData = {
    title: `${t("settings.admin.analytics.title")} | ${process.env.APP_NAME}`,
    appConfiguration,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "update") {
    await verifyUserHasPermission(request, "admin.settings.analytics.update");
    await getOrCreateAppConfiguration({ request });
    await updateAppConfiguration({
      analyticsEnabled: Boolean(form.get("enabled")),
      analyticsSimpleAnalytics: Boolean(form.get("simpleAnalytics")),
      analyticsPlausibleAnalytics: Boolean(form.get("plausibleAnalytics")),
      analyticsGoogleAnalyticsTrackingId: form.get("googleAnalyticsTrackingId")?.toString(),
    });
    return Response.json({});
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminSettingsAnalytics() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();

  const [enabled, setEnabled] = useState(data.appConfiguration.analytics.enabled);
  const [simpleAnalytics, setSimpleAnalytics] = useState(data.appConfiguration.analytics.simpleAnalytics);
  const [plausibleAnalytics, setPlausibleAnalytics] = useState(data.appConfiguration.analytics.plausibleAnalytics);
  const [googleAnalyticsTrackingId, setGoogleAnalyticsTrackingId] = useState(data.appConfiguration.analytics.googleAnalyticsTrackingId ?? "");

  const [canUpdate] = useState(getUserHasPermission(adminData, "admin.settings.analytics.update"));

  return (
    <EditPageLayout title={""}>
      <SettingSection
        title={<BackButtonWithTitle href="/admin/settings">{t("settings.admin.analytics.title")}</BackButtonWithTitle>}
        description="Enable analytics to track your website traffic"
      >
        <Form method="post" className="space-y-8">
          <input name="action" value="update" hidden readOnly />
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <InputCheckboxWithDescription
                name="enabled"
                value={enabled}
                setValue={setEnabled}
                title="Enabled"
                description="Built-in analytics for page views and events"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="simpleAnalytics"
                value={simpleAnalytics}
                setValue={setSimpleAnalytics}
                title="SimpleAnalytics enabled"
                description={
                  <a href="https://www.simpleanalytics.com/?referral=hesef" target="_blank" rel="noreferrer">
                    Click here to learn more.
                  </a>
                }
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="plausibleAnalytics"
                value={plausibleAnalytics}
                setValue={setPlausibleAnalytics}
                title="PlausibleAnalytics enabled"
                description={
                  <a href="https://plausible.io/" target="_blank" rel="noreferrer">
                    Click here to learn more.
                  </a>
                }
                disabled={!canUpdate}
              />

              <InputText
                hideChars
                name="googleAnalyticsTrackingId"
                value={googleAnalyticsTrackingId}
                setValue={setGoogleAnalyticsTrackingId}
                title="Google Analytics Tracking ID"
                placeholder="Example: UA-123456789-1"
                disabled={!canUpdate}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="outline" disabled={!canUpdate}>
              {t("shared.save")}
            </Button>
          </div>
        </Form>
      </SettingSection>
    </EditPageLayout>
  );
}
