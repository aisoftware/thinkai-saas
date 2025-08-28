import { ActionFunction, LoaderFunctionArgs, MetaFunction, useActionData } from "react-router";
import { Form, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import InputText from "~/components/ui/input/InputText";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { AppConfiguration, getAppConfiguration, getOrCreateAppConfiguration, updateAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { toast } from "sonner";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";
import SettingSection from "~/components/ui/sections/SettingSection";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  appConfiguration: AppConfiguration;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  await verifyUserHasPermission(request, "admin.settings.authentication.view");
  const appConfiguration = await getAppConfiguration({ request });
  const data: LoaderData = {
    title: `${t("settings.admin.authentication.title")} | ${process.env.APP_NAME}`,
    appConfiguration,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "update") {
    await verifyUserHasPermission(request, "admin.settings.authentication.update");
    await getOrCreateAppConfiguration({ request });
    await updateAppConfiguration({
      authRequireEmailVerification: Boolean(form.get("requireEmailVerification")),
      authRequireOrganization: Boolean(form.get("requireOrganization")),
      authRequireName: Boolean(form.get("requireName")),
      authRecaptchaSiteKey: form.get("recaptchaSiteKey")?.toString(),
      subscriptionRequired: Boolean(form.get("required")),
      subscriptionAllowSubscribeBeforeSignUp: Boolean(form.get("allowSubscribeBeforeSignUp")),
      subscriptionAllowSignUpBeforeSubscribe: Boolean(form.get("allowSignUpBeforeSubscribe")),
    });
    return Response.json({ success: t("shared.updated") });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminSettingsAuthentication() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();
  const actionData = useActionData<{ success?: string; error?: string }>();

  const [requireEmailVerification, setRequireEmailVerification] = useState(data.appConfiguration.auth.requireEmailVerification);
  const [requireOrganization, setRequireOrganization] = useState(data.appConfiguration.auth.requireOrganization);
  const [requireName, setRequireName] = useState(data.appConfiguration.auth.requireName);
  const [recaptchaSiteKey, setRecaptchaSiteKey] = useState(data.appConfiguration.auth.recaptcha.siteKey);

  const [required, setRequired] = useState(data.appConfiguration.subscription.required);
  const [allowSubscribeBeforeSignUp, setAllowSubscribeBeforeSignUp] = useState(data.appConfiguration.subscription.allowSubscribeBeforeSignUp);
  const [allowSignUpBeforeSubscribe, setAllowSignUpBeforeSubscribe] = useState(data.appConfiguration.subscription.allowSignUpBeforeSubscribe);

  const [canUpdate] = useState(getUserHasPermission(adminData, "admin.settings.authentication.update"));

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  return (
    <EditPageLayout>
      <SettingSection title={<BackButtonWithTitle href="/admin/settings">{t("settings.admin.authentication.title")}</BackButtonWithTitle>}>
        <Form method="post" className="space-y-8">
          <input name="action" value="update" hidden readOnly />
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
            <div className="sm:col-span-6">
              <InputCheckboxWithDescription
                name="requireEmailVerification"
                value={requireEmailVerification}
                setValue={setRequireEmailVerification}
                title="Require email verification"
                description="Users needs to verify their email before using the application"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="requireOrganization"
                value={requireOrganization}
                setValue={setRequireOrganization}
                title="Require organization"
                description="Organization name is required to register"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="requireName"
                value={requireName}
                setValue={setRequireName}
                title="Require name"
                description="User name is required to register"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="required"
                value={required}
                setValue={setRequired}
                title="Subscription required"
                description="Active subscription is required to use the application"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="allowSubscribeBeforeSignUp"
                value={allowSubscribeBeforeSignUp}
                setValue={setAllowSubscribeBeforeSignUp}
                title="Allow subscription before sign up"
                description="Users can subscribe/buy before setting up their account"
                disabled={!canUpdate}
              />

              <InputCheckboxWithDescription
                name="allowSignUpBeforeSubscribe"
                value={allowSignUpBeforeSubscribe}
                setValue={setAllowSignUpBeforeSubscribe}
                title="Allow sign up without subscription"
                description="Users can register before subscribing/buying a plan"
                disabled={!canUpdate}
              />

              <InputText
                name="recaptchaSiteKey"
                value={recaptchaSiteKey}
                setValue={setRecaptchaSiteKey}
                type="password"
                title="reCAPTCHA v2 site key"
                help="Users need to pass recaptcha to register"
                disabled={!canUpdate}
              />
            </div>
          </div>

          <div className="flex justify-end pt-8">
            <LoadingButton type="submit" disabled={!canUpdate}>
              {t("shared.save")}
            </LoadingButton>
          </div>
        </Form>
      </SettingSection>
    </EditPageLayout>
  );
}
