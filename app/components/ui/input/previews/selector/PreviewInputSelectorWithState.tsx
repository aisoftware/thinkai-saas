import { useState } from "react";
import InputSelector from "~/components/ui/input/InputSelector";

type SelectType = string | number | undefined;
export default function PreviewInputSelectorWithState() {
  const [value, setValue] = useState<SelectType>("2");
  return (
    <div id="input-selector">
      <div className="not-prose border-border bg-background border border-dashed p-6">
        <InputSelector
          name="name"
          title="Title"
          options={[
            {
              name: "Option 1",
              value: "1",
            },
            {
              name: "Option 2",
              value: "2",
            },
          ]}
          value={value}
          setValue={setValue}
        />
      </div>
    </div>
  );
}
