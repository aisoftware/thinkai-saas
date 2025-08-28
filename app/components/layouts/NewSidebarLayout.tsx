import { Fragment, ReactNode, useEffect } from "react";
import { useParams } from "react-router";
import { useKBar } from "kbar";
import NewSidebarMenu from "./NewSidebarMenu";

interface Props {
  layout: "app" | "admin" | "docs";
  children: ReactNode;
  className?: string;
}

export default function NewSidebarLayout({ layout, children }: Props) {
  const { query } = useKBar();
  const params = useParams();

  useEffect(() => {
    try {
      // @ts-ignore
      $crisp?.push(["do", "chat:hide"]);
    } catch (e) {
      // ignore
    }
  }, []);

  function onOpenCommandPalette() {
    query.toggle();
  }

  return (
    <Fragment>
      <NewSidebarMenu key={params.tenant} layout={layout} onOpenCommandPalette={onOpenCommandPalette}>
        {children}
      </NewSidebarMenu>
    </Fragment>
  );
}
