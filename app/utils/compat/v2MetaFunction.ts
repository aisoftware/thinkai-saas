import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";

export type v2MetaFunction<T = unknown> = (args: { data: T & { metatags: MetaTagsDto } }) => MetaTagsDto;
