import { useState } from "react";
import InputText from "~/components/ui/input/InputText";

export default function PreviewInputTextWithAllOptions() {
  const [value, setValue] = useState("");
  return (
    <div id="input-text-with-all-options">
      <div className="border-border bg-background border border-dashed p-6">
        <InputText name="name" title="Title" value={value} setValue={setValue} minLength={0} maxLength={10} required />
      </div>
    </div>
  );
}
