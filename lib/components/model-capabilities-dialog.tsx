import { Button } from "@/components/form/button";
import { Toggle } from "@/components/form/toggle";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/form/dialog";
import { useFormContext } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";

interface ModelCapabilitiesDialogProps {
  modelId: string;
}

export function ModelCapabilitiesDialog({ modelId }: ModelCapabilitiesDialogProps) {
  const { watch, setValue } = useFormContext<ModelFormData>();

  const modelIndex = watch(`models`).findIndex((model) => model.modelId === modelId);
  const supportedParams = watch(`models.${modelIndex}.supportedParams`) || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 hover:[&>svg]:stroke-blue-500 rounded-full transition-colors cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="dark:stroke-[#ECECEC] hover:stroke-blue-500 dark:hover:stroke-blue-400"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white dark:bg-gray-800 max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-[#ECECEC]">
            Model Capabilities
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-[#ECECEC]/70">
            Configure the capabilities of this model
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
              Core Capabilities
            </h3>
            <Toggle
              label="Support Plugins (via OpenAI Functions)"
              description={`Enable if the model supports the "functions" or "tool_calls" parameter.`}
              checked={watch(`models.${modelIndex}.supportPlugins`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportPlugins`, checked)}
            />
            <Toggle
              label="Support OpenAI Vision"
              description={`Enable if the model supports image input.`}
              checked={watch(`models.${modelIndex}.supportVision`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportVision`, checked)}
            />
            <Toggle
              label="Support System Role"
              description={`Enable if the model supports the "system" role.`}
              checked={watch(`models.${modelIndex}.supportSystem`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportSystem`, checked)}
            />
            <Toggle
              label="Support Streaming Output"
              description={`Enable if the model supports streaming output ("stream": true).`}
              checked={watch(`models.${modelIndex}.supportStreaming`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportStreaming`, checked)}
            />
            <Toggle
              label="Support Reasoning"
              description="Enable if the model supports reasoning capabilities."
              checked={watch(`models.${modelIndex}.supportReasoning`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportReasoning`, checked)}
            />
            <Toggle
              label="Support Prompt Caching"
              description="Enable if the model supports caching of prompts for better performance."
              checked={watch(`models.${modelIndex}.supportPromptCaching`)}
              onChange={(checked) => setValue(`models.${modelIndex}.supportPromptCaching`, checked)}
            />
            <Toggle
              label="Support Assistant First Message"
              description="Enable if the model supports starting conversations with an assistant message."
              checked={watch(`models.${modelIndex}.supportAssistantFirstMessage`)}
              onChange={(checked) =>
                setValue(`models.${modelIndex}.supportAssistantFirstMessage`, checked)
              }
            />
            <Toggle
              label="Support Token Estimation"
              description="Enable if the model supports estimating token counts for inputs and outputs."
              checked={watch(`models.${modelIndex}.supportTokenEstimation`)}
              onChange={(checked) =>
                setValue(`models.${modelIndex}.supportTokenEstimation`, checked)
              }
            />
          </div>

          {supportedParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                Supported Parameters
              </h3>
              <div className="space-y-3">
                {supportedParams.map((param, paramIndex) => (
                  <label
                    key={paramIndex}
                    className="flex items-center gap-2 text-sm text-gray-700 dark:text-[#ECECEC]"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                      checked={param.enabled}
                      onChange={(e) => {
                        const newParams = [...supportedParams];
                        newParams[paramIndex] = {
                          ...newParams[paramIndex],
                          enabled: e.target.checked,
                        };
                        setValue(`models.${modelIndex}.supportedParams`, newParams);
                      }}
                    />
                    {param.key}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <DialogFooter className="flex-shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Done
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
