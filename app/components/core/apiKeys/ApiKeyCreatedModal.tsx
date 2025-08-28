import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import InputText from "~/components/ui/input/InputText";
import OpenModal from "~/components/ui/modals/OpenModal";

interface Props {
  apiKey: {
    key: string;
    alias: string;
  };
  redirectTo: string;
}
export default function ApiKeyCreatedModal({ apiKey, redirectTo }: Props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <OpenModal className="max-w-md" onClose={() => navigate(redirectTo)}>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between space-x-1">
          <h3 className="font-bold">API Key created</h3>
          <div className="text-muted-foreground">Alias: {apiKey.alias}</div>
        </div>
        <div className="text-muted-foreground text-sm">This is your only chance to see this key. Copy it and store it store it somewhere safe.</div>
        <InputText className="grow select-all" disabled={true} name="" title="API Key" withLabel={false} defaultValue={apiKey.key} />
        <div className="border-border border-t pt-4">
          <ButtonPrimary className="flex w-full justify-center text-center" to={redirectTo}>
            {t("shared.acceptAndContinue")}
          </ButtonPrimary>
        </div>
      </div>
    </OpenModal>
  );
}
