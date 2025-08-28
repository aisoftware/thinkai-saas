import { useState } from "react";
import InputNumber from "~/components/ui/input/InputNumber";

export default function PreviewInputNumberWithAllOptions() {
  const [value, setValue] = useState<number | undefined>(undefined);
  return (
    <div id="input-number-with-all-options">
      <div className="border-border bg-background border border-dashed p-6">
        <InputNumber name="name" title="Title" value={value} setValue={setValue} min={0} max={10} required step="0.01" />
      </div>
    </div>
  );
}
