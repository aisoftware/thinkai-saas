import { Link } from "react-router";

interface Props {
  items: { name: string; title: string; type?: ModelPropertyType; customType?: { name: string; route?: string }; description?: string; required: boolean }[];
}
export enum ModelPropertyType {
  String,
  DateTime,
  Int,
  Decimal,
  Boolean,
  UUID,
  Cuid,
}

export default function DocPropertiesTable({ items }: Props) {
  return (
    <div className="not-prose flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow-xs ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-left text-sm font-semibold sm:pl-6">
                    Name
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-left text-sm font-semibold">
                    Title
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-left text-sm font-semibold">
                    Type
                  </th>
                  <th scope="col" className="text-foreground w-full px-2 py-1.5 text-left text-sm font-semibold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border bg-background divide-y">
                {items.map((item) => (
                  <tr key={item.name}>
                    <td className="text-foreground whitespace-nowrap px-2 py-1.5 text-sm font-medium sm:pl-6">
                      {item.name} {item.required && <span className="ml-1 text-red-500">*</span>}
                    </td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-sm">{item.title}</td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-sm">
                      {item.customType && (
                        <span className="font-bold">
                          {item.customType.route ? (
                            <Link className="text-theme-600 underline" to={item.customType.route}>
                              {item.customType.name}
                            </Link>
                          ) : (
                            item.customType.name
                          )}
                        </span>
                      )}
                      {item.type !== undefined && ModelPropertyType[item.type]}
                    </td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-sm">{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
