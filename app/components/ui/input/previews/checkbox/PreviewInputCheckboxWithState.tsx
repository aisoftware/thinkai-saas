import { useState } from "react";
import InputCheckbox from "~/components/ui/input/InputCheckbox";

export default function PreviewInputCheckboxWithState() {
  const [value, setValue] = useState(true);
  return (
    <div id="input-checkbox-with-state">
      <div className="border-border bg-background border border-dashed p-6">
        <InputCheckbox name="name" title="Title" value={value} setValue={setValue} />
      </div>
    </div>
  );
}
