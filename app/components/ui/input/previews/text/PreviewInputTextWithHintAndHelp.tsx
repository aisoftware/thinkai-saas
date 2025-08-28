import InputText from "~/components/ui/input/InputText";

export default function PreviewInputTextWithHint() {
  return (
    <div id="input-text-with-hint-and-help">
      <div className="border-border bg-background border border-dashed p-6">
        <InputText name="name" title="Title" hint={<span className="text-red-500">Hint text</span>} defaultValue="" />
      </div>
    </div>
  );
}
