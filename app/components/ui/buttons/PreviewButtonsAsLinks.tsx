import { useLocation } from "react-router";
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import ButtonTertiary from "./ButtonTertiary";

export default function PreviewButtonsAsLinks() {
  const currentRoute = useLocation().pathname;
  return (
    <div id="buttons-as-links">
      <div className="not-prose border-border bg-background border border-dashed p-6">
        <div className="w-full space-y-2">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
            <ButtonPrimary to={currentRoute}>Primary</ButtonPrimary>
            <ButtonSecondary to={currentRoute}>Secondary</ButtonSecondary>
            <ButtonTertiary to={currentRoute}>Tertiary</ButtonTertiary>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
            <ButtonPrimary disabled={true} to={currentRoute}>
              Primary
            </ButtonPrimary>
            <ButtonSecondary disabled={true} to={currentRoute}>
              Secondary
            </ButtonSecondary>
            <ButtonTertiary disabled={true} to={currentRoute}>
              Tertiary
            </ButtonTertiary>
          </div>
        </div>
      </div>
    </div>
  );
}
