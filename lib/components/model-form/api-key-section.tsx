import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Label } from "@/components/form/label";
import { UseFormReturn } from "react-hook-form";
import { ModelFormData } from "@/schemas/model-form";
import { UseMutationResult } from "@tanstack/react-query";
import { Provider, Model } from "@/types";
import { providers } from "@/ai-providers";

interface APIKeySectionProps {
  form: UseFormReturn<ModelFormData>;
  provider: Provider;
  checkApiKey: UseMutationResult<void, Error, { apiKey: string }, unknown>;
  getModels: UseMutationResult<Model[] | undefined, Error, { apiKey: string }, unknown>;
}

export function APIKeySection({ form, provider, checkApiKey, getModels }: APIKeySectionProps) {
  return (
    <div className="space-y-2">
      <div className="flex gap-3 w-full">
        <div className="flex-1">
          <div className="flex gap-3 items-end w-full mb-4">
            <div className="flex-1">
              <div className="flex w-full justify-between">
                <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
                  API Key
                </Label>
              </div>
              <Input
                placeholder="Enter API Key"
                className="w-full"
                type="password"
                {...form.register("apiKey")}
                error={form.formState.errors.apiKey?.message}
              />
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={async () => {
                if (!form.getValues("apiKey")) {
                  form.setError("apiKey", {
                    message: "API key is required",
                  });
                  return;
                }
                checkApiKey.mutate({ apiKey: form.getValues("apiKey") });
              }}
              disabled={getModels.isPending || checkApiKey.isPending}
            >
              {checkApiKey.isPending || getModels.isPending ? "Checking..." : "Check API Key"}
            </Button>
          </div>
          {!providers[provider.id].information.endpoint ? (
            <div className="mb-2">
              <div className="flex w-full justify-between">
                <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
                  Endpoint
                </Label>
                <Label className="text-xs text-gray-500 dark:text-[#ECECEC]/70 ml-auto">
                  * Must be compatible with /v1/chat/completions
                </Label>
              </div>
              <Input
                placeholder="https://localhost:8000/v1/chat/completions"
                className="w-full"
                type="text"
                {...form.register("endpoint")}
                error={form.formState.errors.endpoint?.message}
              />
            </div>
          ) : null}
        </div>
      </div>
      {providers[provider.id].information.apiKeyInstructions}
    </div>
  );
}
