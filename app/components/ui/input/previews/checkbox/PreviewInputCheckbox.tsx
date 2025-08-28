import InputCheckbox from "~/components/ui/input/InputCheckbox";

export default function PreviewInputCheckbox() {
  return (
    <div id="input-checkbox">
      <div className="border-border bg-background border border-dashed p-6">
        <InputCheckbox name="name" title="Title" />
      </div>
    </div>
  );
}
