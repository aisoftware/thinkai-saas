import { ActionFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { Form } from "react-router";
import { useTranslation } from "react-i18next";
import UnderConstruction from "~/components/ui/misc/UnderConstruction";
import { getTranslations } from "~/locale/i18next.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.settings.internationalization.view");
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    title: `${t("settings.admin.internationalization.title")} | ${process.env.APP_NAME}`,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.settings.internationalization.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "update") {
    // TODO
    return Response.json({});
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function AdminSettingsInternationalization() {
  const { t, i18n } = useTranslation();
  // const data = useLoaderData<LoaderData>();

  // const [canUpdate] = useState(getUserHasPermission(adminData, "admin.settings.internationalization.update"));

  return (
    <EditPageLayout title={<BackButtonWithTitle href="/admin/settings">{t("settings.admin.internationalization.title")}</BackButtonWithTitle>}>
      <div>
        <UnderConstruction title="TODO: Internationalization (Save custom translations on the database?)" />

        <Form method="post" className="divide-y-gray-200 space-y-8 divide-y">
          <input name="action" value="update" hidden readOnly />

          {JSON.stringify(i18n)}

          {/* <div className="flex justify-end pt-8">
            <LoadingButton type="submit" disabled={!getUserHasPermission(adminData, "admin.settings.internationalization.update")}>
              {t("shared.save")}
            </LoadingButton>
          </div> */}
        </Form>
      </div>
    </EditPageLayout>
  );
}
