import OrderIndexButtons from "~/components/ui/sort/OrderIndexButtons";
import TableSimple from "~/components/ui/tables/TableSimple";
import { KbNavLinkDto } from "~/modules/knowledgeBase/dtos/KbNavLinkDto";

export default function KbNavLinksTable({
  items,
  setItems,
}: {
  items: KbNavLinkDto[];
  setItems: React.Dispatch<
    React.SetStateAction<
      {
        name: string;
        href: string;
        order: number;
      }[]
    >
  >;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between space-x-2 text-xs">
        <label className="text-muted-foreground font-medium">{"Nav links"}</label>
        <button type="button" onClick={() => setItems([])} className="text-muted-foreground hover:text-foreground/80">
          {"Clear"}
        </button>
      </div>

      <div className="">
        <TableSimple
          items={items.sort((a, b) => a.order - b.order)}
          headers={[
            {
              name: "order",
              title: "",
              value: (item, idx) => (
                <OrderIndexButtons
                  idx={idx}
                  items={items.map((f, idx) => {
                    return {
                      idx: idx,
                      order: f.order,
                    };
                  })}
                  onChange={(newItems) => {
                    setItems(
                      newItems.map((f, i) => {
                        return { ...items[i], order: f.order };
                      })
                    );
                  }}
                />
              ),
            },
            {
              name: "title",
              title: "Title",
              value: (item) => item.name,
              editable: () => true,
              setValue: (value, idx) => setItems((e) => e.map((item, i) => (i === idx ? { ...item, name: value } : item))),
            },
            {
              name: "href",
              title: "Link",
              value: (item) => item.href,
              editable: () => true,
              setValue: (value, idx) => setItems((e) => e.map((item, i) => (i === idx ? { ...item, href: value } : item))),
            },
          ]}
        />
        <button
          type="button"
          onClick={() => {
            setItems([...items, { name: "Link " + (items.length + 1), href: "/", order: items.length + 1 }]);
          }}
          className="border-border text-muted-foreground focus:text-foreground bg-background hover:bg-secondary/90 mt-2 flex items-center space-x-1 rounded-md border px-2 py-1 text-xs focus:ring-3 focus:ring-gray-300 focus:ring-offset-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span className="font-medium uppercase">{"Add"}</span>
        </button>
      </div>
    </div>
  );
}
