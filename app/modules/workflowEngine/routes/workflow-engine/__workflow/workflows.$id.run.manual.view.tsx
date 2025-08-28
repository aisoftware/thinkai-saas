import { Form, Link, useActionData, useLoaderData, useNavigation, useParams, useSubmit } from "react-router";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Colors } from "~/application/enums/shared/Colors";
import MonacoEditor from "~/components/editors/MonacoEditor";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import BreadcrumbSimple from "~/components/ui/breadcrumbs/BreadcrumbSimple";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import WorkflowInputExamplesDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowInputExamplesDropdown";
import WorkflowRunDropdown from "~/modules/workflowEngine/components/workflows/buttons/WorkflowRunDropdown";
import { WorkflowBlockExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowBlockExecutionDto";
import { WorkflowBlockTypes } from "~/modules/workflowEngine/dtos/WorkflowBlockTypes";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { WorkflowsIdRunManualApi } from "./workflows.$id.run.manual.api.server";
import { WorkflowDto } from "../../../dtos/WorkflowDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";

export default function WorkflowsIdRunManualView() {
  const data = useLoaderData<WorkflowsIdRunManualApi.LoaderData>();
  const actionData = useActionData<WorkflowsIdRunManualApi.ActionData>();
  const params = useParams();
  const submit = useSubmit();
  const navigation = useNavigation();
  const isLoading = navigation.state === "submitting";

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [execution, setExecution] = useState<WorkflowExecutionDto | null>(null);
  const [inputData, setInputData] = useState("{}");
  const [waitingBlockInput, setWaitingBlockInput] = useState("");

  const waitingForInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setTimeout(() => {
      waitingForInputRef.current?.focus();
    }, 100);
  }, [execution]);

  useEffect(() => {
    if (data.workflow.inputExamples.length > 0) {
      setSelectedTemplate(data.workflow.inputExamples[0].title);
      setInputData(JSON.stringify(data.workflow.inputExamples[0].input, null, 2));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.workflow.inputExamples.length]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }

    if (actionData?.execution) {
      setExecution(actionData.execution);
      actionData?.execution?.executionAlerts.forEach((executionAlert) => {
        if (executionAlert.type === "error") {
          toast.error(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        } else {
          toast.success(executionAlert.message, {
            position: "bottom-right",
            duration: 10000,
          });
        }
      });
    }
  }, [actionData]);

  function onExecute() {
    const form = new FormData();
    form.append("action", "execute");
    form.append("input", inputData);
    submit(form, {
      method: "post",
    });
  }

  function onSubmitWaitingBlock(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set("action", "continue-execution");
    form.set("executionId", execution?.id ?? "");
    submit(form, {
      method: "post",
    });
    setWaitingBlockInput("");
  }

  return (
    <div>
      <div className="border-border bg-background w-full border-b px-4 py-2 shadow-2xs">
        <BreadcrumbSimple
          menu={[{ title: "Workflows", routePath: UrlUtils.getModulePath(params, `workflow-engine/workflows`) }, { title: data.workflow.name }]}
        />
      </div>
      <div className="border-border bg-background w-full border-b px-4 py-2 shadow-2xs">
        <div className="flex justify-between">
          <Link
            to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions`)}
            className="hover:bg-secondary bg-background text-foreground/80 rounded px-2 py-1 text-sm font-semibold shadow-2xs ring-1 ring-inset ring-gray-300"
          >
            <span className="mr-1">&larr;</span> Back to executions
          </Link>
          <WorkflowRunDropdown workflow={data.workflow} />
        </div>
      </div>
      <div className="mx-auto max-w-2xl space-y-2 p-4">
        <div className="flex justify-between space-x-2">
          <div className="text-lg font-semibold">Run Workflow Manually</div>
        </div>

        {!execution ? (
          <div>
            <div className="space-y-1">
              <div className="flex items-center justify-between space-x-2">
                <div className="text-sm font-medium">{selectedTemplate || "Input Data"}</div>
                {data.workflow.inputExamples.length > 0 && (
                  <WorkflowInputExamplesDropdown
                    workflow={data.workflow}
                    onSelected={(item) => {
                      setSelectedTemplate(item.title);
                      setInputData(JSON.stringify(item.input, null, 2));
                    }}
                  />
                )}
              </div>
              <div className="border-border overflow-hidden rounded-md border">
                <MonacoEditor className="h-20" theme="light" value={inputData} onChange={setInputData} hideLineNumbers tabSize={2} language="json" />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <LoadingButton actionName="execute" onClick={onExecute} disabled={!WorkflowUtils.canRun(data.workflow)}>
                Run {!WorkflowUtils.canRun(data.workflow) && <span className="ml-1 text-xs opacity-50"> (not live)</span>}
              </LoadingButton>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Link
                target="_blank"
                to={UrlUtils.getModulePath(params, `workflow-engine/workflows/${data.workflow.id}/executions?executionId=${execution.id}`)}
                className="border-border bg-background hover:border-border flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed"
              >
                <>
                  <div className="flex justify-center">
                    <div className=" ">View execution flow</div>
                  </div>
                </>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setExecution(null);
                }}
                className="border-border bg-background hover:border-border flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed"
              >
                <div className="flex justify-center">
                  <div className=" ">Run again</div>
                </div>
              </button>
            </div>
            <WorkflowRun workflow={execution} />
            <div className="text-foreground font-medium">Blocks executed ({execution.blockRuns.length})</div>
            <div className="w-full space-y-1">
              {execution.blockRuns.map((blockRun) => {
                return <BlockRun key={blockRun.id} workflow={data.workflow} blockRun={blockRun} />;
              })}
            </div>
            {execution.waitingBlock && (
              <Form onSubmit={onSubmitWaitingBlock}>
                <div className="space-y-1">
                  {execution.waitingBlock.input.title && (
                    <label className="text-muted-foreground text-xs font-medium">{execution.waitingBlock.input.title}</label>
                  )}
                  <div className="relative flex items-center">
                    <input
                      ref={waitingForInputRef}
                      autoFocus
                      type="text"
                      name="input"
                      id="input"
                      autoComplete="off"
                      value={waitingBlockInput}
                      onChange={(e) => setWaitingBlockInput(e.currentTarget.value)}
                      className={clsx(
                        "focus:ring-theme-600 placeholder:text-muted-foreground block w-full rounded-md border-0 py-3 pr-14 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6",
                        isLoading ? "base-spinner bg-secondary/90" : "bg-white"
                      )}
                      placeholder={execution.waitingBlock.input.placeholder}
                      required
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="text-muted-foreground border-border inline-flex items-center rounded border px-1 font-sans text-xs"
                      >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </div>
        )}

        {actionData?.error && <ErrorBanner title="Error" text={actionData.error} />}
      </div>
    </div>
  );
}

function BlockRun({ workflow, blockRun }: { workflow: WorkflowDto; blockRun: WorkflowBlockExecutionDto }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const block = workflow.blocks.find((x) => x.id === blockRun.workflowBlockId);
  const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block?.type);
  if (!block || !workflowBlock) {
    return null;
  }
  return (
    <div className="space-y-0">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={clsx(
          "hover:bg-secondary border-border bg-background cursor-pointer select-none overflow-hidden rounded-md border p-2",
          isExpanded ? "rounded-b-none" : "rounded-md"
        )}
      >
        <div className="flex justify-between space-x-2">
          <div className="flex items-center space-x-1 truncate">
            <div className="flex items-center space-x-2 truncate">
              <workflowBlock.icon className="text-muted-foreground h-4 w-4 shrink-0" />
              <div className="text-foreground/80 shrink-0 truncate text-xs font-medium">[{workflowBlock.name}]</div>
              {blockRun.error ? (
                <div className="truncate text-xs text-red-600">{blockRun.error}</div>
              ) : blockRun.output ? (
                <div className="text-muted-foreground truncate text-xs">{JSON.stringify({ output: blockRun.output })}</div>
              ) : null}
            </div>
            <div className="text-muted-foreground text-sm">{block.description || ""}</div>
          </div>

          <div className="shrink-0">
            {block.type === "if" ? (
              <div>{blockRun.output?.condition ? <SimpleBadge title="True" color={Colors.BLUE} /> : <SimpleBadge title="False" color={Colors.ORANGE} />}</div>
            ) : block.type === "switch" ? (
              <SimpleBadge title={blockRun.output?.condition?.toString()} color={Colors.BLUE} />
            ) : (
              <div>
                {blockRun.status === "running" ? (
                  <SimpleBadge title="Running" color={Colors.YELLOW} />
                ) : blockRun.status === "error" ? (
                  <SimpleBadge title="Error" color={Colors.RED} />
                ) : blockRun.status === "success" ? (
                  <SimpleBadge title="Success" color={Colors.GREEN} />
                ) : (
                  <SimpleBadge title="Unknown Status" color={Colors.GRAY} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isExpanded && (
        <div onClick={(e) => e.preventDefault()} className="border-border bg-secondary/90 overflow-hidden rounded-md rounded-t-none border p-2">
          {blockRun.error && <ErrorBanner title="Error" text={blockRun.error} />}
          <InputOutput input={blockRun.input} output={blockRun.output} />
        </div>
      )}
    </div>
  );
}

function WorkflowRun({ workflow }: { workflow: WorkflowExecutionDto }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className=" space-y-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="border-border bg-background hover:border-border flex w-full flex-col items-center rounded-lg border-2 border-dotted p-3 text-sm font-medium hover:border-dashed"
      >
        <div className="flex justify-center"> Workflow Input and Output</div>
      </button>
      {isExpanded && (
        <div onClick={(e) => e.preventDefault()} className="border-border bg-secondary/90 overflow-hidden rounded-md border p-2">
          <InputOutput input={workflow.input} output={workflow.output} />
        </div>
      )}
    </div>
  );
}

function InputOutput({ input, output }: { input?: any; output?: any }) {
  return (
    <div className="space-y-1">
      {!input || JSON.stringify(input) === "{}" ? (
        <div className="border-border flex flex-col items-center border bg-gray-200 p-3">
          <div className="text-muted-foreground text-center text-xs">No input</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-foreground/80 text-xs font-medium">Input</div>
            <button
              type="button"
              className="hover:text-muted-foreground text-foreground/80 text-xs font-medium"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(input))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(input, null, 2)}</pre>
          </div>
        </div>
      )}

      {!output || JSON.stringify(output) === "{}" ? (
        <div className="border-border flex flex-col items-center border bg-gray-200 p-3">
          <div className="text-muted-foreground text-center text-xs">No output</div>
        </div>
      ) : (
        <div className="space-y-1">
          <div className="flex items-center justify-between space-x-2">
            <div className="text-foreground/80 text-xs font-medium">Outputs</div>
            <button
              type="button"
              className="hover:text-muted-foreground text-foreground/80 text-xs font-medium"
              onClick={() => navigator.clipboard.writeText(JSON.stringify(output))}
            >
              Copy
            </button>
          </div>
          <div className="prose max-h-24 overflow-auto">
            <pre>{JSON.stringify(output, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
