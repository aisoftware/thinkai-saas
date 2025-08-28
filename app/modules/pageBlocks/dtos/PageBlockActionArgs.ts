import { Params } from "react-router";
import { TFunction } from "i18next";

export interface PageBlockActionArgs {
  request: Request;
  params: Params;
  t: TFunction;
  form: FormData;
}
