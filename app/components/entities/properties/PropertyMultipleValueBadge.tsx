import { RowValueMultipleDto } from "~/application/dtos/entities/RowValueMultipleDto";

type OptionDto = { value: string; name: string | null };

interface Props {
  values: RowValueMultipleDto[] | null;
  options?: OptionDto[];
}
export default function PropertyMultipleValueBadge({ values, options }: Props) {
  function getSelectedNames() {
    let names: string[] = [];
    if (values) {
      for (const value of values) {
        const option = options?.find((f) => f.value === value.value);
        names.push(option?.name ?? value.value);
      }
    }
    return names;
  }
  return (
    <div className="flex space-x-1">
      {getSelectedNames().join(", ") ?? <span className="text-gray-300"></span>}
      {/* {values?.map((value) => {
        return (
          <div
            key={value.id}
            className="relative  mx-0.5 inline-flex max-w-sm shrink-0 select-none items-center space-x-0.5 overflow-x-auto rounded-full border border-border bg-secondary px-2 py-0.5"
          >
            <div className="text-xs font-medium text-muted-foreground">{value.value}</div>
          </div>
        );
      })} */}
    </div>
  );
}
