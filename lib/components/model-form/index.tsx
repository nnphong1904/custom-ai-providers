import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider, Model } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { providers } from "@/ai-providers";
import { buildModelConfigJson, JsonBuilderOutput } from "@/utils/json-builder";
import { ModelFormHeader } from "./header";
import { APIKeySection } from "./api-key-section";
import { ModelsTable } from "./models-table";
import { AdvancedSettings } from "./advanced-settings";
import { ManualModelConfig } from "./manual-model-config";

const defaultSupportedParams = [
  "temperature",
  "top_p",
  "frequency_penalty",
  "presence_penalty",
  "max_tokens",
  "stream",
  "reasoning_effort",
];

export function ModelForm({
  provider,
  onSave,
}: {
  provider: Provider;
  onSave: (result: JsonBuilderOutput) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      apiKey: "",
      endpoint: providers[provider.id].information.endpoint,
      headers: [],
      bodyParams: [],
      models: providers[provider.id].getModels
        ? []
        : [
            {
              modelId: "",
              contextLength: 2048,
              pricePerMillionTokens: {
                prompt: 0,
                completion: 0,
              },
              supportPlugins: false,
              supportVision: false,
              supportSystem: true,
              supportStreaming: true,
              supportedParams: providers[provider.id].getModels
                ? []
                : defaultSupportedParams.map((param) => ({
                    key: param,
                    enabled: param !== "reasoning_effort",
                  })),
            },
          ],
    },
  });

  const onSubmit = (data: ModelFormData) => {
    const jsons = buildModelConfigJson({
      userInput: data,
      provider: provider.id,
    });
    onSave?.(jsons);
  };

  const canGetModels = !!providers[provider.id].getModels;

  const getModels = useMutation({
    mutationFn: async ({ apiKey }: { apiKey: string }) => {
      if (providers[provider.id].getModels) {
        const result = await providers[provider.id].getModels?.(apiKey);
        return result;
      }
      return [];
    },
    onError: (error) => {
      console.error("Error fetching models:", error);
    },
  });

  const checkApiKey = useMutation({
    mutationFn: async ({ apiKey }: { apiKey: string }) => {
      const response = await fetch(providers[provider.id].information.endpoint, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          model: providers[provider.id].testModel,
          messages: [{ role: "user", content: "Hello, world!" }],
        }),
      });
      if (!response.ok) {
        throw new Error("Invalid API key");
      }
    },
    onSuccess: () => {
      form.clearErrors("apiKey");
      getModels.mutate({ apiKey: form.getValues("apiKey") });
    },
    onError: (error) => {
      form.setError("apiKey", {
        message: error.message,
      });
    },
  });

  const models = useMemo(() => getModels.data ?? [], [getModels.data]);

  // Effect to handle search
  useEffect(() => {
    if (!models.length) return;

    if (!debouncedSearchTerm.trim()) {
      setFilteredModels(models);
      return;
    }

    const searchTermLower = debouncedSearchTerm.toLowerCase();
    const filtered = models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchTermLower) ||
        model.id.toLowerCase().includes(searchTermLower),
    );
    setFilteredModels(filtered);
  }, [debouncedSearchTerm, models]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
      <div className="space-y-6">
        <ModelFormHeader provider={provider} />

        <div className="space-y-6">
          <APIKeySection
            form={form}
            provider={provider}
            checkApiKey={checkApiKey}
            getModels={getModels}
          />

          {canGetModels ? (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-[#ECECEC]">
                Available Models
              </h2>
              {!form.watch("apiKey") || !getModels.data?.length ? (
                <div className="rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-500 p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="mt-2 text-sm text-gray-500 dark:text-[#ECECEC]/70">
                      Please enter your API key to fetch available models
                    </p>
                  </div>
                </div>
              ) : (
                <ModelsTable
                  form={form}
                  models={models}
                  filteredModels={filteredModels}
                  searchTerm={searchTerm}
                  onSearchChange={(value) => setSearchTerm(value)}
                />
              )}
            </div>
          ) : (
            <ManualModelConfig form={form} provider={provider} />
          )}

          <AdvancedSettings form={form} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full m-0"
            disabled={
              form.formState.isSubmitting ||
              checkApiKey.isPending ||
              getModels.isPending ||
              !!form.formState.errors.apiKey?.message
            }
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Model"}
          </Button>
          {!checkApiKey.isPending && Object.entries(form.formState.errors)[0] && (
            <p className="mt-2 text-sm text-red-500">
              {Object.entries(form.formState.errors)[0][1]?.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
