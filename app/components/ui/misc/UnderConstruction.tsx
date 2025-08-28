import { useTranslation } from "react-i18next";
import SaasRockProFeature from "./SaasRockProFeature";

export default function UnderConstruction({ title, description, proFeature }: { title?: string; description?: string; proFeature?: boolean }) {
  const { t } = useTranslation();
  return (
    <div className="space-y-3">
      {title && (
        <div className="text-foreground text-lg font-extrabold">
          <span>{title}</span>
        </div>
      )}
      {description && <div className="text-muted-foreground text-sm">{description}</div>}
      {proFeature && <SaasRockProFeature />}
      <div className="flex flex-col justify-center space-y-4 rounded-md border-2 border-dashed border-yellow-300 bg-yellow-50 py-6 text-center font-medium dark:bg-yellow-100 dark:text-yellow-800">
        <div>{t("shared.underConstruction")} 🚧</div>
      </div>
    </div>
  );
}
