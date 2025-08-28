import InputText from "../InputText";

export default function PreviewInputText() {
  return (
    <div id="input-text">
      <div className="border-border bg-background border border-dashed p-6">
        <InputText name="name" title="Title" defaultValue={undefined} />
      </div>
    </div>
  );
}
