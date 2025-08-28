import { SideBarItem } from "./SidebarItem";

export type SidebarGroupDto = {
  items: SideBarItem[];
  title?: string;
  type?: "main" | "secondary" | "quick-link";
};
