import { ActionFunction, LoaderFunctionArgs, MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import PageMetaTagsRouteIndex from "~/modules/pageBlocks/components/pages/PageMetaTagsRouteIndex";
import { PageMetaTags_Index } from "~/modules/pageBlocks/routes/pages/PageMetaTags_Index";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import BackButtonWithTitle from "~/components/ui/buttons/BackButtonWithTitle";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export const loader = (args: LoaderFunctionArgs) => PageMetaTags_Index.loader(args);
export const action: ActionFunction = (args) => PageMetaTags_Index.action(args);

export default () => {
  const { t } = useTranslation();
  return (
    <EditPageLayout title={<BackButtonWithTitle href="/admin/settings">{t("pages.seo")}</BackButtonWithTitle>}>
      <PageMetaTagsRouteIndex />
    </EditPageLayout>
  );
};
