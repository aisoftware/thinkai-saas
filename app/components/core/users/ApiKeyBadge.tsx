import { ApiKey } from "@prisma/client";
import { useTranslation } from "react-i18next";

interface Props {
  item: ApiKey;
}
export default function ApiKeyBadge({ item }: Props) {
  const { t } = useTranslation();
  return (
    <div>
      {t("models.apiKey.object")} <span className="text-muted-foreground text-xs font-normal italic">{item.alias}</span>
    </div>
  );
}
