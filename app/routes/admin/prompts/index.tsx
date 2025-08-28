import { useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { db } from "~/utils/db.server";
import NumberUtils from "~/utils/shared/NumberUtils";

type LoaderData = {
  summary: {
    flowsTotal: number;
    templatesTotal: number;
    executionsTotal: number;
    resultsTotal: number;
  };
};
export const loader = async () => {
  const data: LoaderData = {
    summary: {
      flowsTotal: await db.promptFlow.count(),
      templatesTotal: await db.promptTemplate.count(),
      executionsTotal: await db.promptFlowExecution.count(),
      resultsTotal: await db.promptTemplateResult.count(),
    },
  };
  return Response.json(data);
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="border-border border-b pb-5">
        <h3 className="text-lg font-medium leading-6">{t("shared.overview")}</h3>
      </div>
      <dl className="grid grid-cols-2 gap-2">
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Prompt Flows</div>
          </dt>
          <dd className="mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.flowsTotal)}</dd>
        </div>
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Templates</div>
          </dt>
          <dd className="mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.templatesTotal)}</dd>
        </div>
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Executions</div>
          </dt>
          <dd className="mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.executionsTotal)}</dd>
        </div>
        <div className="bg-background overflow-hidden rounded-lg px-4 py-3 shadow ">
          <dt className="text-muted-foreground truncate text-xs font-medium uppercase">
            <div>Results</div>
          </dt>
          <dd className="mt-1 truncate text-2xl font-semibold">{NumberUtils.intFormat(data.summary.resultsTotal)}</dd>
        </div>
      </dl>
    </div>
  );
}
