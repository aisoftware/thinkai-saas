import { ActionFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form, useActionData, useLoaderData } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { getTranslations } from "~/locale/i18next.server";
import { AppConfiguration, deleteAppConfiguration, getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  appConfiguration: AppConfiguration;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  await verifyUserHasPermission(request, "admin.settings.danger.reset");
  const appConfiguration = await getAppConfiguration({ request });
  const data: LoaderData = {
    title: `${t("settings.admin.danger.title")} | ${process.env.APP_NAME}`,
    appConfiguration,
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
export const action: ActionFunction = async ({ request }) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "delete") {
    await verifyUserHasPermission(request, "admin.settings.danger.reset");
    await deleteAppConfiguration();
    return Response.json({ success: "Configuration reset successfully" });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminSettingsDanger() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.error);
    } else if (actionData?.success) {
      toast.success(actionData?.success);
    }
  }, [actionData]);
  return (
    <EditPageLayout title={<BackButtonWithTitle href="/admin/settings">{t("settings.admin.danger.title")}</BackButtonWithTitle>}>
      <Form method="post" className="divide-y-gray-200 mt-6 space-y-8 divide-y">
        <input name="action" value="delete" hidden readOnly />
        <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6 sm:gap-x-6">
          <div className="sm:col-span-6">
            <h2 className="text-foreground text-xl font-medium">Reset</h2>
            <p className="text-muted-foreground mt-1 text-sm">Go back to the initial application configuration.</p>
          </div>
          <div className="sm:col-span-6">
            <h2 className="text-foreground font-medium">Current configuration</h2>
            <div className="prose mt-1">
              <pre>{JSON.stringify(data.appConfiguration, null, 2)}</pre>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <ButtonPrimary destructive type="submit">
            {t("settings.reset")}
          </ButtonPrimary>
        </div>
      </Form>
    </EditPageLayout>
  );
}
