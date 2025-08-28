import InputNumber from "~/components/ui/input/InputNumber";

export default function PreviewInputNumber() {
  return (
    <div id="input-number">
      <div className="border-border bg-background border border-dashed p-6">
        <InputNumber name="name" title="Title" defaultValue={undefined} />
      </div>
    </div>
  );
}
