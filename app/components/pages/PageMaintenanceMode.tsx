import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function PageMaintenanceMode() {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <h1 className="text-4xl font-bold">{t("shared.maintenance.title")}</h1>
      <p className="text-xl">{t("shared.maintenance.description")}</p>
      <Link to="." className="text-muted-foreground dark:text-muted-foreground text-sm underline">
        {t("shared.clickHereToTryAgain")}
      </Link>
    </div>
  );
}
