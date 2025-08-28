import React, { useState } from "react";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import WorkflowUtils from "../../helpers/WorkflowUtils";
import InputText from "~/components/ui/input/InputText";
import { WorkflowBlockType, WorkflowBlockTypes } from "../../dtos/WorkflowBlockTypes";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import WorkflowIcon from "~/modules/workflowEngine/components/icons/WorkflowIcon";
import { WorkflowConditionsGroupDto } from "../../dtos/WorkflowConditionDtos";
import WorkflowEditBlock from "./WorkflowBlockEditor";
import WorkflowBlockErrors from "./misc/WorkflowBlockErrors";
import WorkflowInputExamples from "./WorkflowInputExamples";
import { Input } from "~/components/ui/input";

interface Props {
  selectedBlock: WorkflowBlockDto | null;
  workflow: WorkflowDto;
  addingNextBlockFrom: { fromBlock: WorkflowBlockDto; condition: string | null } | null;
  onSave: (workflow: WorkflowDto) => void;
  onSetTrigger: (node: WorkflowBlockType) => void;
  onSelectedBlock: (workflowBlock: WorkflowBlockDto | null) => void;
  onSaveBlock: (block: WorkflowBlockDto) => void;
  onAddingNextBlock: (data: { fromBlock: WorkflowBlockDto; condition: string | null } | null) => void;
  onAddBlock: (block: { from: WorkflowBlockDto; type: WorkflowBlockType; condition: string | null }) => void;
  onDeleteBlock: (blockId: string) => void;
  onDeleteConnection: (connection: { fromBlockId: string; toBlockId: string }) => void;
  onUpdateConditionsGroups: (blockId: string, conditionGroups: WorkflowConditionsGroupDto[]) => void;
}
export default function WorkflowEditorSidebar({
  selectedBlock,
  workflow,
  addingNextBlockFrom,
  onSave,
  onSetTrigger,
  onSelectedBlock,
  onSaveBlock,
  onAddingNextBlock,
  onAddBlock,
  onDeleteBlock,
  onDeleteConnection,
  onUpdateConditionsGroups,
}: Props) {
  let content;
  if (!WorkflowUtils.hasTriggerNode(workflow)) {
    content = (
      <SelectBlockSidebar
        title="Select a Trigger"
        description="What should trigger this workflow?"
        placeholder="Search triggers..."
        type="trigger"
        onSelected={(e) => onSetTrigger(e)}
        onBack={() => onSelectedBlock(null)}
      />
    );
  } else if (addingNextBlockFrom) {
    content = (
      <SelectBlockSidebar
        title="Select an Action"
        description="What should happen next?"
        placeholder="Search actions..."
        type="action"
        onSelected={(e) =>
          onAddBlock({
            from: addingNextBlockFrom.fromBlock,
            condition: addingNextBlockFrom.condition,
            type: e,
          })
        }
        onBack={() => onAddingNextBlock(null)}
      />
    );
  } else if (!selectedBlock) {
    content = <WorkflowSettingsSidebar workflow={workflow} onSave={onSave} onSelectedBlock={onSelectedBlock} onDeleteBlock={onDeleteBlock} />;
  } else {
    content = (
      <WorkflowEditBlock
        key={selectedBlock.id}
        workflow={workflow}
        block={selectedBlock}
        onBack={() => onSelectedBlock(null)}
        onSaveBlock={onSaveBlock}
        onAddingNextBlock={onAddingNextBlock}
        onDeleteBlock={onDeleteBlock}
        onDeleteConnection={onDeleteConnection}
        onSelectedBlock={onSelectedBlock}
        onUpdateConditionsGroups={onUpdateConditionsGroups}
      />
    );
  }

  return <div className="">{content}</div>;
}

function SelectBlockSidebar({
  title,
  description,
  placeholder,
  type,
  onSelected,
  onBack,
}: {
  title: string;
  description: string;
  placeholder: string;
  type: "trigger" | "action";
  onSelected: (node: WorkflowBlockType) => void;
  onBack: () => void;
}) {
  const categories = WorkflowBlockTypes.filter((f) => f.type === type)
    .map((f) => f.category)
    .filter((v, i, a) => a.indexOf(v) === i);

  const [searchInput, setSearchInput] = useState("");

  return (
    <div>
      <div className="border-border flex h-12 justify-between border-b px-4 py-3 pr-6">
        <button
          type="button"
          className="hover:text-muted-foreground text-muted-foreground bg-background rounded-md focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={onBack}
        >
          <span className="sr-only">Close panel</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
      </div>
      <div className="px-4 py-4  ">
        <div className="space-y-2">
          <div className="space-y-1 text-sm">
            <div className="text-foreground/80 font-medium">{title}</div>
            <div className="text-muted-foreground">{description}</div>
          </div>
          <div className="border-border border-t"></div>
          <div>
            <InputText autoFocus placeholder={placeholder} value={searchInput} setValue={setSearchInput} />
          </div>
          <div className="space-y-2">
            {categories.map((category) => {
              let nodeTypes = WorkflowBlockTypes.filter((f) => f.type === type && f.category === category);
              if (searchInput) {
                nodeTypes = nodeTypes.filter(
                  (f) => f.name.toLowerCase().includes(searchInput.toLowerCase()) || f.category.toLowerCase().includes(searchInput.toLowerCase())
                );
              }
              if (nodeTypes.length === 0) {
                return null;
              }
              return (
                <div key={category} className="space-y-2">
                  <div className="text-muted-foreground text-xs font-medium">{category}</div>
                  {nodeTypes.map((item) => {
                    return (
                      <button
                        key={item.name}
                        type="button"
                        onClick={() => onSelected(item.value)}
                        className="border-border bg-secondary hover:bg-secondary/90 w-full rounded-lg border p-2 text-left"
                      >
                        <div className="flex items-center space-x-2">
                          <item.icon className="text-muted-foreground h-4 w-4" />
                          <div className="text-muted-foreground text-sm">{item.name}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowSettingsSidebar({
  workflow,
  onSave,
  onSelectedBlock,
  onDeleteBlock,
}: {
  workflow: WorkflowDto;
  onSave: (workflow: WorkflowDto) => void;
  onSelectedBlock: (workflowBlock: WorkflowBlockDto) => void;
  onDeleteBlock: (blockId: string) => void;
}) {
  return (
    <div className="px-4 py-4  ">
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <div className="bg-secondary/90 rounded-md p-2">
              <WorkflowIcon className="text-foreground h-4 w-4" />
            </div>
            <Input
              className="hover:bg-secondary/90 w-full rounded-lg px-1 py-1 text-lg font-semibold focus:outline-hidden"
              defaultValue={workflow.name}
              placeholder="Workflow name..."
              // on click select all text
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                // @ts-ignore
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              onBlur={(e) => {
                if (e.target.value !== workflow.name) {
                  workflow.name = e.target.value;
                  onSave({
                    ...workflow,
                    name: e.target.value,
                  });
                }
              }}
            />
          </div>
          <div>
            <Input
              className=" hover:bg-secondary/90 w-full truncate rounded-lg px-1 py-1 text-sm focus:outline-hidden"
              defaultValue={workflow.description}
              placeholder="Add a description..."
              // on click select all text
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                // @ts-ignore
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.currentTarget.blur();
                }
              }}
              onBlur={(e) => {
                if (e.target.value !== workflow.description) {
                  workflow.description = e.target.value;
                  onSave({
                    ...workflow,
                    description: e.target.value,
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="border-border border-t"></div>
        <div className="space-y-3">
          <div className="space-y-0.5 text-sm">
            <div className="text-foreground/80 font-medium">Status</div>
            <div className="text-muted-foreground">Nodes validation</div>
          </div>
          <div className="space-y-2">
            {WorkflowUtils.getBlocksErrors(workflow).length === 0 ? (
              <div>
                <div className="group flex w-full flex-col items-center justify-center rounded-lg border border-dashed border-teal-300 bg-teal-50 p-3 text-center text-xs dark:bg-teal-900 dark:text-teal-50">
                  All nodes are valid.
                </div>
              </div>
            ) : (
              WorkflowUtils.getBlocksErrors(workflow).map(({ block, errors }) => {
                const workflowBlock = WorkflowBlockTypes.find((x) => x.value === block.type);
                if (!workflowBlock) {
                  return <div key={block.id}>Unknown block type: {block.type}</div>;
                }
                return (
                  <button
                    type="button"
                    key={block.id}
                    className="hover:bg-secondary border-border bg-background group relative w-full overflow-y-auto rounded-lg border p-2 text-left"
                    onClick={() => onSelectedBlock(block)}
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBlock(block.id);
                      }}
                      className="hover:text-muted-foreground text-muted-foreground bg-background absolute right-2 top-2 hidden rounded-md focus:outline-hidden focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 group-hover:block"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-4 w-4">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                      </svg>
                    </button>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <workflowBlock.icon className="text-muted-foreground h-4 w-4" />
                        <div className="text-muted-foreground text-sm">{workflowBlock.name}</div>
                      </div>
                      <div className="border-border border-t" />
                      <WorkflowBlockErrors errors={errors} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="border-border border-t"></div>
        <WorkflowInputExamples workflow={workflow} />
      </div>
    </div>
  );
}
