import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, MetaFunction, redirect } from "react-router";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import Logo from "~/components/brand/Logo";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import RefreshIcon from "~/components/ui/icons/RefreshIcon";
import { getTranslations } from "~/locale/i18next.server";
import { getPermissionName } from "~/utils/db/permissions/permissions.db.server";
import { getUserPermission } from "~/utils/helpers/.server/PermissionsService";
import { getUserInfo } from "~/utils/session.server";

type LoaderData = {
  title: string;
  permission: { name: string; description: string };
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const permission = await getPermissionName(params.permission ?? "");
  const searchParams = new URLSearchParams(new URL(request.url).search);
  const redirectTo = searchParams.get("redirect")?.toString();
  if (redirectTo) {
    if (!permission) {
      throw redirect(redirectTo);
    }
    const userInfo = await getUserInfo(request);
    const { userPermission } = await getUserPermission({ userId: userInfo.userId, permissionName: permission.name, tenantId: params.tenant });
    if (userPermission) {
      throw redirect(redirectTo);
    }
  } else if (!permission) {
    throw redirect("/404?error=permission-not-found");
  }

  const data: LoaderData = {
    title: `${t("shared.unauthorized")} | ${process.env.APP_NAME}`,
    permission,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function Page401() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { permission } = useLoaderData<LoaderData>();
  return (
    <>
      <div className="">
        <div className="flex min-h-full flex-col pb-12 pt-16">
          <main className="mx-auto flex w-full max-w-7xl grow flex-col justify-center px-4 sm:px-6 lg:px-8">
            <div className="flex shrink-0 justify-center">
              <Logo />
            </div>
            <div className="py-16">
              <div className="text-center">
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">{t("shared.unauthorized")}</h1>
                <p className="text-muted-foreground mt-2 text-base">Contact your admin and verify your permissions.</p>
                <div className="text-muted-foreground mx-auto mt-2 w-96 text-left text-base">
                  <div className="border-border bg-secondary flex justify-start space-y-2 border border-dashed p-4 dark:border-gray-700 dark:bg-gray-900">
                    <div className="space-y-2">
                      <div className="font-bold">{permission.description}</div>
                      <div>
                        <span>Permission &rarr;</span> <span className=" font-light italic">{permission.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div>
                      <ButtonTertiary type="button" onClick={() => navigate(-1)}>
                        <div> &larr;</div>
                        <div>Go back</div>
                      </ButtonTertiary>
                    </div>

                    <div>
                      <ButtonTertiary type="button" onClick={() => navigate(location)}>
                        <div>Re-check permission</div>
                        <RefreshIcon className="h-4 w-4" />
                      </ButtonTertiary>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <FooterBlock />
    </>
  );
}
