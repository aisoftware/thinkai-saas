import { Menu } from "@headlessui/react";
import { Link, useParams } from "react-router";
import clsx from "clsx";
import { Fragment } from "react";
import DropdownOptions from "~/components/ui/dropdowns/DropdownOptions";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import WorkflowUtils from "~/modules/workflowEngine/helpers/WorkflowUtils";
import UrlUtils from "~/utils/app/UrlUtils";

export default function WorkflowRunDropdown({ workflow }: { workflow: WorkflowDto }) {
  const params = useParams();
  return (
    <DropdownOptions
      disabled={!WorkflowUtils.canRun(workflow)}
      button={
        <div
          className={clsx(
            "text-foreground/80 rounded px-2 py-1 text-sm font-semibold shadow-2xs ring-1 ring-inset ring-gray-300",
            WorkflowUtils.canRun(workflow) ? "bg-background hover:bg-secondary/90" : "bg-secondary/90 cursor-not-allowed opacity-50"
          )}
        >
          <div>Run {!WorkflowUtils.canRun(workflow) && <span className="text-xs opacity-50"> (not live)</span>}</div>
        </div>
      }
      options={
        <div>
          {[
            {
              name: "Manually",
              value: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}/run/manual`),
              disabled: !WorkflowUtils.canRun(workflow),
            },
            {
              name: "API call",
              value: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}/run/api`),
              disabled: !WorkflowUtils.canRun(workflow),
            },
            {
              name: "Stream",
              value: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}/run/stream`),
              disabled: !WorkflowUtils.canRun(workflow),
            },
          ].map((option) => {
            return (
              <Menu.Item key={option.name}>
                {({ active, close }) => (
                  <Fragment>
                    {option.disabled ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          close();
                        }}
                        className={clsx(
                          "hover:bg-secondary/90 w-full truncate text-left",
                          active ? "text-foreground bg-secondary/90" : "text-foreground/80",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </button>
                    ) : (
                      <Link
                        to={option.value}
                        type="button"
                        onClick={(e) => {
                          close();
                        }}
                        className={clsx(
                          "hover:bg-secondary/90 w-full truncate text-left",
                          active ? "text-foreground bg-secondary/90" : "text-foreground/80",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        {option.name}
                      </Link>
                    )}
                  </Fragment>
                )}
              </Menu.Item>
            );
          })}
        </div>
      }
    ></DropdownOptions>
  );
}
