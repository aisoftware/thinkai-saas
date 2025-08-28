import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { Link, useParams } from "react-router";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getAllKnowledgeBaseCategories } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  items: KnowledgeBaseCategoryWithDetails[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
    request,
  });
  if (!knowledgeBase) {
    return redirect("/admin/knowledge-base/bases");
  }
  const items = await getAllKnowledgeBaseCategories({
    knowledgeBaseSlug: params.slug!,
    language: undefined,
  });
  const data: LoaderData = {
    knowledgeBase,
    items,
  };
  return data;
};
export default function () {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  return (
    <EditPageLayout
      title="Categories"
      withHome={false}
      menu={[
        { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
        { title: data.knowledgeBase.title, routePath: `/admin/knowledge-base/bases/${data.knowledgeBase.slug}` },
        { title: "Categories", routePath: `/admin/knowledge-base/bases/${params.slug}/categories` },
      ]}
    >
      <div className="space-y-2">
        {data.knowledgeBase.languages.map((f) => {
          return (
            <div key={f} className="space-y-2">
              <Link
                to={f}
                className="border-border hover:border-border relative block space-y-2 rounded-lg border-2 border-dashed px-12 py-6 text-center focus:border-solid focus:outline-hidden"
              >
                <div className="font-bold">{KnowledgeBaseUtils.getLanguageName(f)}</div>
                <div className="text-sm">{data.items.filter((x) => x.language === f).length} categories</div>
              </Link>
            </div>
          );
        })}
      </div>
    </EditPageLayout>
  );
}
