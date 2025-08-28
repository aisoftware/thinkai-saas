import { useLoaderData } from "react-router";
import { OnboardingSessionOverviewApi } from "../../api/sessions/OnboardingSessionOverviewApi.server";

export default function () {
  const data = useLoaderData<OnboardingSessionOverviewApi.LoaderData>();
  return (
    <div>
      <div>Email: {data.item.user.email}</div>
    </div>
  );
}
