import { useRef } from "react";
import { WorkflowDto } from "../../dtos/WorkflowDto";
import { WorkflowBlockDto } from "../../dtos/WorkflowBlockDto";
import WorkflowVariableButton from "./WorkflowVariableButton";
import clsx from "clsx";

export default function WorkflowVariableTextInput({
  name,
  placeholder,
  workflow,
  block,
  value,
  onChange,
  className,
}: {
  name: string;
  placeholder: string | undefined;
  workflow: WorkflowDto;
  block: WorkflowBlockDto;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const refString = useRef<HTMLInputElement>(null);

  function onSelected(variable: { name: string }) {
    if (!refString.current) {
      return;
    }
    var start = refString.current.selectionStart || 0;
    var end = refString.current.selectionEnd || 0;
    var text = refString.current.value;
    var before = text.substring(0, start);
    var after = text.substring(end, text.length);
    onChange(before + variable.name + after);
  }
  return (
    <div className={clsx("relative rounded-md shadow-2xs", className)}>
      <input
        ref={refString}
        name={name}
        id={name}
        className="border-border bg-secondary hover:bg-secondary/90 w-full rounded-lg border px-2 py-2 pr-10 text-sm focus:outline-hidden"
        value={value}
        onClick={(e: React.MouseEvent<HTMLInputElement>) => {
          // @ts-ignore
          e.target.select();
        }}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.currentTarget.blur();
          }
        }}
      />
      <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 ">
        <WorkflowVariableButton workflow={workflow} block={block} onSelected={onSelected} />
      </div>
    </div>
  );
}
