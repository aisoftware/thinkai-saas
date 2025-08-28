import { ActionFunctionArgs, LoaderFunction, redirect, useLoaderData, useActionData } from "react-router";
import { useTranslation } from "react-i18next";
import { Outlet, useSubmit } from "react-router";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import { createPromptFlow } from "~/modules/promptBuilder/db/promptFlows.db.server";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getAllPromptFlowGroups, getPromptFlowGroup, PromptFlowGroupWithDetails } from "~/modules/promptBuilder/db/promptFlowGroups.db.server";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import { OpenAIDefaults } from "~/modules/ai/utils/OpenAIDefaults";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";

type LoaderData = {
  title: string;
  items: PromptFlowGroupWithDetails[];
};
export const loader: LoaderFunction = async ({ request }) => {
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    title: `${t("prompts.builder.title")} | Groups | ${process.env.APP_NAME}`,
    items: await getAllPromptFlowGroups(),
  };
  return Response.json(data);
};

type ActionData = {
  error?: string;
  success?: string;
};
export const action = async ({ request }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "add-prompt-flow") {
    const id = form.get("id")?.toString() ?? "";

    const promptFlowGroup = await getPromptFlowGroup(id);
    if (!promptFlowGroup) {
      return Response.json({ error: t("shared.notFound") }, { status: 400 });
    }

    const promptFlow = await createPromptFlow({
      model: OpenAIDefaults.model,
      stream: false,
      title: `${promptFlowGroup.title}: Untitled #${promptFlowGroup.promptFlows.length + 1}`,
      description: "",
      actionTitle: "",
      executionType: "sequential",
      promptFlowGroupId: promptFlowGroup.id,
      inputEntityId: null,
      isPublic: true,
      templates: promptFlowGroup.templates.map((t) => ({
        order: t.order,
        title: t.title,
        template: "",
        temperature: OpenAIDefaults.temperature,
        maxTokens: 0,
      })),
    });

    // return Response.json({ success: t("shared.success") });
    return redirect(`/admin/prompts/builder/${promptFlow.id}`);
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  function onCreatePromptFlow(item: PromptFlowGroupWithDetails) {
    const form = new FormData();
    form.set("action", "add-prompt-flow");
    form.set("id", item.id);
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title={"Groups"}
      buttons={
        <>
          <ButtonSecondary to="new">
            <PlusIcon className="h-3 w-3" />
            <div>{t("shared.new")}</div>
          </ButtonSecondary>
        </>
      }
    >
      <TableSimple
        items={data.items}
        actions={[
          {
            title: "Add Variant",
            onClick: (idx, item) => onCreatePromptFlow(item),
          },
          {
            title: t("shared.edit"),
            onClickRoute: (_, i) => `${i.id}`,
          },
        ]}
        headers={[
          {
            name: "title",
            title: "Title",
            value: (i) => (
              <div className="flex max-w-xs flex-col truncate">
                <div className="truncate text-base font-bold">{i.title}</div>
                <div className="text-muted-foreground truncate text-sm">{i.description}</div>
              </div>
            ),
          },
          {
            name: "templates",
            title: "Templates",
            value: (i) => (
              <div className="flex flex-col">
                {i.templates.map((t, idx) => (
                  <div key={idx} className="text-muted-foreground text-sm">
                    #{t.order} - {t.title}
                  </div>
                ))}
              </div>
            ),
            className: "w-full",
          },
          {
            name: "promptFlows",
            title: "Prompt Flows",
            value: (i) => (
              <div className="flex flex-col">
                {i.promptFlows.length === 0 && <div className="text-muted-foreground text-sm">No prompt flows</div>}
                {i.promptFlows.map((t, idx) => (
                  <div key={idx} className="text-muted-foreground text-sm">
                    {t.title}
                  </div>
                ))}
              </div>
            ),
          },
        ]}
        noRecords={
          <div className="p-12 text-center">
            <h3 className="mt-1 text-sm font-medium text-gray-900">No groups</h3>
            <p className="text-muted-foreground mt-1 text-sm">Group prompt flows that share the same template structure.</p>
          </div>
        }
      />

      <Outlet />

      <ActionResultModal actionData={actionData ?? undefined} showSuccess={false} />
    </EditPageLayout>
  );
}
