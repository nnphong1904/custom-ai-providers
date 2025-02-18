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
import { UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";

interface ModelCapabilitiesDialogProps {
  modelIndex: number;
  watch: UseFormWatch<ModelFormData>;
  setValue: UseFormSetValue<ModelFormData>;
}

export function ModelCapabilitiesDialog({
  modelIndex,
  watch,
  setValue,
}: ModelCapabilitiesDialogProps) {
  const supportedParams = watch(`models.${modelIndex}.supportedParams`) || [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="p-1 hover:bg-gray-100 rounded-full">
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
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="bg-white max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Model Capabilities</DialogTitle>
          <DialogDescription>Configure the capabilities of this model</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Core Capabilities</h3>
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
          </div>

          {supportedParams.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Supported Parameters</h3>
              <div className="space-y-3">
                {supportedParams.map((param, paramIndex) => (
                  <label key={paramIndex} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300"
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
            <Button type="button">Done</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
