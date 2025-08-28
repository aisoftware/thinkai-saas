import PreviewDropdownsSimple from "./PreviewDropdownsSimple";
import PreviewDropdownsWithClick from "./PreviewDropdownsWithClick";

export default function PreviewDropdowns() {
  return (
    <div id="dropdowns">
      <div className="space-y-1">
        <h3 className="text-sm font-medium">Dropdowns - Simple</h3>
        <div className="border-border bg-background space-x-2 border border-dashed p-6">
          <PreviewDropdownsSimple />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm font-medium">Dropdowns</h3>
        <div className="border-border bg-background space-x-2 border border-dashed p-6">
          <PreviewDropdownsWithClick />
        </div>
      </div>
    </div>
  );
}
