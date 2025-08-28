import clsx from "clsx";

interface Props {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
}
export default function SettingSection({
  title,
  description,
  children,
  className = "border border-border dark:border-border/50 shadow-2xs px-4 py-5 bg-background sm:p-6 rounded-md",
  size = "md",
}: Props) {
  return (
    <div
      className={clsx(
        size === "xs" && "md:grid md:gap-2 lg:grid-cols-1",
        size === "sm" && "md:grid md:gap-2 lg:grid-cols-2",
        size === "md" && "md:grid md:gap-2 lg:grid-cols-3",
        size === "lg" && "md:grid md:gap-2 lg:grid-cols-4"
      )}
    >
      <div className={clsx(size === "sm" && "md:col-span-1", size === "md" && "md:col-span-1", size === "lg" && "md:col-span-1")}>
        <div className="sm:px-0">
          <h3 className="text-foreground text-lg font-medium leading-6">{title}</h3>
          <div className="text-muted-foreground mt-1 text-sm leading-5">{description}</div>
        </div>
      </div>
      <div className={clsx("mt-5 md:mt-0", size === "sm" && "md:col-span-1", size === "md" && "md:col-span-2", size === "lg" && "md:col-span-3")}>
        <div>
          <div className="sm:rounded-sm">
            <div className={className}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
