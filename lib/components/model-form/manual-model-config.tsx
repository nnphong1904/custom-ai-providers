import { Input } from "@/components/form/input";
import { Label } from "@/components/form/label";
import { Toggle } from "@/components/form/toggle";
import { useFormContext } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";
import { Provider } from "@/types";
import { providers } from "@/ai-providers";

const defaultSupportedParams = [
  "temperature",
  "top_p",
  "frequency_penalty",
  "presence_penalty",
  "max_tokens",
  "stream",
  "reasoning_effort",
];

interface ManualModelConfigProps {
  provider: Provider;
}

export function ManualModelConfig({ provider }: ManualModelConfigProps) {
  const form = useFormContext<ModelFormData>();
  return (
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
            Model ID
          </Label>
          <Input
            type="text"
            placeholder="e.g., ggml-gpt4all-j-v1.3-groovy.bin"
            className="mt-1 block w-full"
            {...form.register("models.0.modelId", {
              onChange: (e) => {
                const modelId = e.target.value;
                const capabilities = providers[provider.id].detectCapabilities(modelId);
                form.setValue("models.0.supportPlugins", capabilities.supportPlugins);
                form.setValue("models.0.supportVision", capabilities.supportVision);
                form.setValue("models.0.supportSystem", capabilities.supportSystem);
                form.setValue("models.0.supportStreaming", capabilities.supportStreaming);
                form.setValue("models.0.supportReasoning", capabilities.supportReasoning);
                form.setValue("models.0.supportPromptCaching", capabilities.supportPromptCaching);
                form.setValue(
                  "models.0.supportAssistantFirstMessage",
                  capabilities.supportAssistantFirstMessage,
                );
                form.setValue(
                  "models.0.supportTokenEstimation",
                  capabilities.supportTokenEstimation,
                );
              },
            })}
          />
          <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
            {providers[provider.id].information.getModelIdInstruction}
          </span>
        </div>
        <div className="flex-1">
          <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
            Context Length
          </Label>
          <Input
            type="number"
            defaultValue={2048}
            className="mt-1 block w-full"
            {...form.register("models.0.contextLength", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
          Price for Cost Estimation (Optional)
        </Label>
        <div className="flex space-x-4 mt-1">
          <div className="flex-1">
            <Input
              type="number"
              placeholder="$ 0.00"
              className="block w-full"
              step={0.01}
              defaultValue={0}
              {...form.register("models.0.pricePerMillionTokens.prompt", {
                valueAsNumber: true,
              })}
            />
            <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">/1M input tokens</span>
          </div>
          <div className="flex-1">
            <Input
              type="number"
              placeholder="$ 0.00"
              step={0.01}
              defaultValue={0}
              className="block w-full"
              {...form.register("models.0.pricePerMillionTokens.completion", {
                valueAsNumber: true,
              })}
            />
            <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">/1M output tokens</span>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
          Model Capabilities
        </Label>
        <Toggle
          label="Support Plugins (via OpenAI Functions)"
          description="Enable if the model supports the 'functions' or 'tool_calls' parameter."
          checked={form.watch("models.0.supportPlugins")}
          onChange={(checked) => form.setValue("models.0.supportPlugins", checked)}
        />
        <Toggle
          label="Support OpenAI Vision"
          description="Enable if the model supports image input."
          checked={form.watch("models.0.supportVision")}
          onChange={(checked) => form.setValue("models.0.supportVision", checked)}
        />
        <Toggle
          label="Support System Role"
          description='Enable if the model supports the "system" role.'
          checked={form.watch("models.0.supportSystem")}
          onChange={(checked) => form.setValue("models.0.supportSystem", checked)}
        />
        <Toggle
          label="Support Streaming Output"
          description='Enable if the model supports streaming output ("stream": true).'
          checked={form.watch("models.0.supportStreaming")}
          onChange={(checked) => form.setValue("models.0.supportStreaming", checked)}
        />
        <Toggle
          label="Support Reasoning"
          description="Enable if the model supports reasoning capabilities."
          checked={form.watch("models.0.supportReasoning")}
          onChange={(checked) => form.setValue("models.0.supportReasoning", checked)}
        />
        <Toggle
          label="Support Prompt Caching"
          description="Enable if the model supports caching of prompts for better performance."
          checked={form.watch("models.0.supportPromptCaching")}
          onChange={(checked) => form.setValue("models.0.supportPromptCaching", checked)}
        />
        <Toggle
          label="Support Assistant First Message"
          description="Enable if the model supports starting conversations with an assistant message."
          checked={form.watch("models.0.supportAssistantFirstMessage")}
          onChange={(checked) => form.setValue("models.0.supportAssistantFirstMessage", checked)}
        />
        <Toggle
          label="Support Token Estimation"
          description="Enable if the model supports estimating token counts for inputs and outputs."
          checked={form.watch("models.0.supportTokenEstimation")}
          onChange={(checked) => form.setValue("models.0.supportTokenEstimation", checked)}
        />
      </div>
      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
          Supported Parameters
        </Label>
        <div className="space-y-2">
          {defaultSupportedParams.map((param) => (
            <label
              key={param}
              className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#ECECEC]"
            >
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                checked={form
                  .watch("models.0.supportedParams")
                  ?.some((p) => p.key === param && p.enabled)}
                onChange={(e) => {
                  const currentParams = form.watch("models.0.supportedParams") || [];
                  const paramIndex = currentParams.findIndex((p) => p.key === param);

                  if (paramIndex === -1) {
                    form.setValue("models.0.supportedParams", [
                      ...currentParams,
                      { key: param, enabled: e.target.checked },
                    ]);
                  } else {
                    const newParams = [...currentParams];
                    newParams[paramIndex] = {
                      ...newParams[paramIndex],
                      enabled: e.target.checked,
                    };
                    form.setValue("models.0.supportedParams", newParams);
                  }
                }}
              />
              {param}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
