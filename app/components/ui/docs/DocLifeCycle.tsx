import CheckIcon from "../icons/CheckIcon";
import XIcon from "../icons/XIcon";

interface Props {
  items: { route: string; c: boolean; r: boolean; u: boolean; d: boolean }[];
}

export default function DocLifeCycle({ items }: Props) {
  return (
    <div className="not-prose flex flex-col">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
          <div className="overflow-hidden shadow-xs ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-secondary">
                <tr>
                  <th scope="col" className="text-foreground w-full px-2 py-1.5 text-left text-sm font-semibold sm:pl-6">
                    Route
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-center text-sm font-semibold">
                    Create
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-center text-sm font-semibold">
                    Read
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-center text-sm font-semibold">
                    Update
                  </th>
                  <th scope="col" className="text-foreground px-2 py-1.5 text-center text-sm font-semibold">
                    Delete
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border bg-background divide-y">
                {items.map((item) => (
                  <tr key={item.route}>
                    <td className="text-foreground whitespace-nowrap px-2 py-1.5 text-sm font-medium sm:pl-6">{item.route}</td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-center text-sm">
                      {item.c ? <CheckIcon className="text-theme-500 mx-auto h-4 w-4" /> : <XIcon className="mx-auto h-4 w-4 text-gray-300" />}
                    </td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-center text-sm">
                      {item.r ? <CheckIcon className="text-theme-500 mx-auto h-4 w-4" /> : <XIcon className="mx-auto h-4 w-4 text-gray-300" />}
                    </td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-center text-sm">
                      {item.u ? <CheckIcon className="text-theme-500 mx-auto h-4 w-4" /> : <XIcon className="mx-auto h-4 w-4 text-gray-300" />}
                    </td>
                    <td className="text-muted-foreground whitespace-nowrap px-2 py-1.5 text-center text-sm">
                      {item.d ? <CheckIcon className="text-theme-500 mx-auto h-4 w-4" /> : <XIcon className="mx-auto h-4 w-4 text-gray-300" />}
                    </td>
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
