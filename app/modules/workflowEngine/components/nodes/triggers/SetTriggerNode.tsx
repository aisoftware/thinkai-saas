import { NodeProps } from "reactflow";

export default function SetTriggerNode(_: NodeProps) {
  return (
    <div className="border-border h-20 w-64 rounded-md border border-dashed bg-slate-100 ring-1 ring-blue-600 ring-offset-2">
      <div className="flex h-full flex-col justify-center space-y-1">
        <div className="text-muted-foreground text-center text-xs">Set a trigger in the sidebar</div>
      </div>
    </div>
  );
}
