import { useState } from "react";
import InputDate from "~/components/ui/input/InputDate";

export default function PreviewInputDateWithState() {
  const [value, setValue] = useState(new Date("1990-01-02"));
  return (
    <div id="input-date-with-state">
      <div className="border-border bg-background border border-dashed p-6">
        <InputDate name="name" title="Title" value={value} onChange={(e) => setValue(e)} />
      </div>
    </div>
  );
}
