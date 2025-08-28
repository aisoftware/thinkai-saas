import InputRadioGroupCards from "../../InputRadioGroupCards";

export default function PreviewInputRadioGroupCards() {
  return (
    <div id="input-radio-group">
      <div className="not-prose border-border bg-background border border-dashed p-6">
        <InputRadioGroupCards
          name="name"
          title="Title"
          options={[
            {
              name: "Option 1",
              value: 1,
            },
            {
              name: "Option 2",
              value: 2,
            },
            {
              name: "Option 3",
              value: 3,
              disabled: true,
            },
          ]}
        />
      </div>
    </div>
  );
}
