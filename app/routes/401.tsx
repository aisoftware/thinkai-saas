import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, MetaFunction } from "react-router";
import { useNavigate } from "react-router";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import Logo from "~/components/brand/Logo";
import { getTranslations } from "~/locale/i18next.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  return {
    title: `${t("shared.unauthorized")} | ${process.env.APP_NAME}`,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

interface Props {
  withFooter?: boolean;
}
export default function Page401({ withFooter = true }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
                <p className="text-primary text-sm font-semibold uppercase tracking-wide">{t("shared.unauthorized")}</p>
                <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">You're not authorized to see this page.</h1>
                <p className="text-muted-foreground mt-2 text-base">Contact your admin and verify your permissions.</p>
                <div className="mt-4 flex">
                  <button type="button" onClick={() => navigate(-1)} className="text-primary hover:text-primary/90 w-full text-center text-sm font-medium">
                    <span aria-hidden="true"> &larr;</span> Go back
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      {withFooter && <FooterBlock />}
    </>
  );
}
