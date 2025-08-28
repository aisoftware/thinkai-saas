import { MoreVerticalIcon } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Link } from "react-router";
import { Fragment } from "react/jsx-runtime";
import { cn } from "~/lib/utils";

interface Props {
  title?: string;
  items: {
    name: string;
    href?: string;
    onClick?: () => void;
    className?: string;
  }[];
  size?: "xs" | "sm" | "lg";
}
export default function DropdownDots({ title, items, size = "sm" }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Button type="button" variant="ghost" size={size}>
          <MoreVerticalIcon
            className="opacity-90"
            size={cn(
              size === "xs" && 12,
              size === "sm" && 16,
              size === "lg" && 20
              //
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-w-44">
        {title && (
          <Fragment>
            <DropdownMenuLabel>{title}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </Fragment>
        )}
        <DropdownMenuGroup>
          {items.map((item, idx) => (
            <DropdownMenuItem key={idx} asChild>
              {item.href ? (
                <Link
                  to={item.href}
                  className={item.className}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item.name}
                </Link>
              ) : (
                <button
                  type="button"
                  className={cn("w-full", item.className)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (item.onClick) {
                      item.onClick();
                    }
                  }}
                >
                  {item.name}
                </button>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={() => deleteItem(item.id)}>
          Delete
        </DropdownMenuItem> */}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
