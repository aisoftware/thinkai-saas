import { Link } from "react-router";
import { Button } from "../button";

export default function BackButtonWithTitle({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-2 truncate text-base sm:text-lg md:text-xl">
      <Button size="xs" variant="outline" asChild className="truncate font-normal">
        <Link to={href}>&larr;</Link>
      </Button>
      <div>{children}</div>
    </div>
  );
}
