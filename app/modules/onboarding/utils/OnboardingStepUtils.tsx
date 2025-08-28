import { OnboardingStep } from "@prisma/client";
import { OnboardingStepBlockDto } from "../blocks/OnboardingBlockUtils";

function parseStepToBlock(step: OnboardingStep) {
  try {
    return JSON.parse(step.block) as OnboardingStepBlockDto;
  } catch (e) {
    return {
      id: "",
      title: "Undefined",
      links: [],
      gallery: [],
      input: [],
    };
  }
}

function getStepDescription(block: OnboardingStepBlockDto) {
  return (
    <div className="flex items-center space-x-2 truncate text-sm">
      <div className="text-foreground shrink-0 font-medium">{block.title}</div>
      {block.description && (
        <>
          <div className="text-muted-foreground">•</div>
          <div className="text-muted-foreground shrink-0">{block.description}</div>
        </>
      )}
      {block.links.length > 0 && (
        <>
          <div className="text-muted-foreground">•</div>
          <div className="text-muted-foreground shrink-0">{block.links.length} links</div>
        </>
      )}
      {block.gallery.length > 0 && (
        <>
          <div className="text-muted-foreground">•</div>
          <div className="text-muted-foreground shrink-0">{block.gallery.length} gallery items</div>
        </>
      )}
      {block.input.length > 0 && (
        <>
          <div className="text-muted-foreground">•</div>
          <div className="text-muted-foreground shrink-0">{block.input.length} input fields</div>
        </>
      )}
    </div>
  );
}

export default {
  parseStepToBlock,
  getStepDescription,
};
