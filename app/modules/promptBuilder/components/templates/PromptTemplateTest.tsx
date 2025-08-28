import { useEffect, useRef, useState } from "react";
import { useCompletion } from "~/modules/novel/lib/ai/react/useCompletion";
import toast from "react-hot-toast";
import { Form } from "react-router";
import { PromptFlowWithDetails } from "../../db/promptFlows.db.server";
import { RowAsJson } from "~/utils/helpers/TemplateApiHelper";
import { PromptTemplateDto } from "../../dtos/PromptTemplateDto";
import { RefInputText } from "~/components/ui/input/InputText";
import InputNumber from "~/components/ui/input/InputNumber";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import InputSelect from "~/components/ui/input/InputSelect";
import { OpenAIDefaults } from "~/modules/ai/utils/OpenAIDefaults";

interface Props {
  promptFlow: PromptFlowWithDetails;
  item: PromptTemplateDto;
  templateDto: { source: string; template: string; result: string };
  row: RowAsJson | null;
}
export default function PromptTemplateTest({ promptFlow, item, templateDto, row }: Props) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [result, setResult] = useState("");

  const [model, setModel] = useState(promptFlow.model);
  const [temperature, setTemperature] = useState<number | undefined>(item.temperature);
  const [maxTokens, setMaxTokens] = useState<number | undefined>(item.maxTokens);
  const [template, setTemplate] = useState(templateDto.result);

  const mainInput = useRef<RefInputText>(null);
  useEffect(() => {
    setTimeout(() => {
      mainInput.current?.input.current?.focus();
    }, 100);
    if (!hasSubmitted) {
      onGetSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { complete, completion, isLoading, stop } = useCompletion({
    id: "prompt-templates-test",
    api: "/api/ai/generate",
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        // va.track("Rate Limit Reached");
        return;
      }
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  useEffect(() => {
    if (completion) {
      setResult(completion);
    }
  }, [completion]);

  function onGetSuggestions(e?: React.FormEvent<HTMLFormElement>) {
    setResult("");
    e?.preventDefault();

    setHasSubmitted(true);

    complete(template, {
      body: {
        model: model,
        temperature: temperature,
        max_tokens: maxTokens,
      },
    });
  }

  return (
    <Form onSubmit={onGetSuggestions} className="space-y-2">
      <div className="space-y-2">
        <div className="space-y-2">
          <div className="flex space-x-2">
            <div className="w-1/2 space-y-1">
              <InputSelect
                name="model"
                title={"Model"}
                value={model}
                setValue={(e) => setModel(e?.toString() ?? "")}
                options={OpenAIDefaults.models.map((f) => f)}
              />
              <InputNumber title="Temperature" value={item.temperature} setValue={setTemperature} step="0.1" />
              <InputNumber title="Max Tokens" value={item.maxTokens} setValue={setMaxTokens} />
              <label className="text-muted-foreground mb-1 flex justify-between space-x-2 truncate text-xs font-medium">
                <span>Template</span>
              </label>
              <textarea
                className="border-border text-muted-foreground h-[calc(100vh-355px)] w-full overflow-y-scroll break-words rounded-md border bg-white p-2"
                value={template}
                onChange={(e) => {
                  setTemplate(e.target.value);
                }}
              />
            </div>

            <div className="w-1/2">
              <label className="text-muted-foreground mb-1 flex justify-between space-x-2 truncate text-xs font-medium">
                <span>Result</span>
              </label>

              <div className="border-border text-muted-foreground bg-secondary/90 h-[calc(100vh-170px)] overflow-y-scroll break-words rounded-md border p-2">
                {result}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <LoadingButton type="submit" isLoading={isLoading}>
            Run
          </LoadingButton>
        </div>
      </div>
    </Form>
  );
}
