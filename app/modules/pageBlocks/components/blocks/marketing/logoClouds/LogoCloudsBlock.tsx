import { LogoCloudsBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/logoClouds/LogoCloudsBlockUtils";
import LogoCloudsVariantCustom from "./LogoCloudsVariantCustom";
import LogoCloudsVariantSimple from "./LogoCloudsVariantSimple";
import LogoCloudsVariantWithHeading from "./LogoCloudsVariantWithHeading";
import LogoCloudsVariantScroll from "./LogoCloudsVariantScroll";

export default function LogoCloudsBlock({ item }: { item: LogoCloudsBlockDto }) {
  return (
    <>
      {item.style === "simple" && <LogoCloudsVariantSimple items={item.logos ?? []} />}
      {item.style === "withBrand" && <LogoCloudsVariantWithHeading headline={item.headline} items={item.logos ?? []} />}
      {item.style === "custom" && <LogoCloudsVariantCustom />}
      {item.style === "scroll" && <LogoCloudsVariantScroll items={item.logos ?? []} />}
    </>
  );
}
