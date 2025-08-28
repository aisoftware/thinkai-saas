import { LoaderFunctionArgs } from "react-router";
import ApiSpecsService from "~/modules/api/services/ApiSpecsService";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const apiSpecs = await ApiSpecsService.generateSpecs({ request });
  return Response.json(apiSpecs.openApi, { headers: { "Content-Type": "application/json" } });
};
