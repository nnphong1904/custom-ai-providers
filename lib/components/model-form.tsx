import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { providers } from "@/ai-providers";
import { buildModelConfigJson, ModelConfig } from "@/utils/json-builder";
import { Label } from "@/components/form/label";

export function ModelForm({
  provider,
  onSave,
}: {
  provider: Provider;
  onSave: (result: ModelConfig[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filteredModels, setFilteredModels] = useState<typeof models>([]);

  const modelDefaultConfig = providers[provider.id].information.defaultConfig;

  const form = useForm<ModelFormData>({
    resolver: zodResolver(modelFormSchema),
    defaultValues: {
      apiKey: "",
      ...modelDefaultConfig,
      endpoint: providers[provider.id].information.endpoint,
      headers: [],
      bodyParams: [],
    },
  });

  const {
    fields: headerFields,
    append: appendHeader,
    remove: removeHeader,
  } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  const {
    fields: paramFields,
    append: appendParam,
    remove: removeParam,
  } = useFieldArray({
    control: form.control,
    name: "bodyParams",
  });

  const {
    fields: modelFields,
    append: appendModel,
    remove: removeModel,
  } = useFieldArray({
    control: form.control,
    name: "models",
  });

  const onSubmit = (data: ModelFormData) => {
    const defaultHeaders = [...providers[provider.id].buildDefaultHeaders(data.apiKey)];
    // Handle form submission
    const jsons = data.models.map((model) => {
      const json = buildModelConfigJson({
        formData: {
          ...data,
          headers: [...defaultHeaders, ...data.headers],
        },
        modelInfo: {
          name: model.name || model.modelId,
          id: model.modelId,
          contextLength: model.contextLength,
          description: model.description,
          pricePerMillionTokens: model.pricePerMillionTokens
            ? {
                prompt: model.pricePerMillionTokens.prompt,
                completion: model.pricePerMillionTokens.completion,
              }
            : {
                prompt: 0,
                completion: 0,
              },
        },
        providerInfo: {
          endpoint: data.endpoint,
          iconUrl: providers[provider.id].information.icon,
          apiType: "openai",
        },
      });
      return json;
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
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-full px-4">
      <div className="space-y-6">
        <div className="flex items-center gap-4 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <img
            src={provider.icon}
            alt={`${provider.name} icon`}
            className="h-12 w-12 rounded-lg shadow-sm"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Add {provider.name} Model</h1>
            <p className="text-sm text-gray-500">
              Configure your model settings and API credentials
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex flex-col sm:flex-row gap-3 w-full items-end">
              <div className="flex-1">
                {!providers[provider.id].information.endpoint ? (
                  <div className="mb-2">
                    <div className="flex w-full justify-between">
                      <Label className="block text-sm font-medium text-gray-700">Endpoint</Label>
                      <Label className="text-xs text-gray-500 ml-auto">
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
                <div>
                  <div className="flex w-full justify-between">
                    <Label className="block text-sm font-medium text-gray-700">API Key</Label>
                  </div>
                  <Input
                    placeholder="Enter API Key"
                    className="w-full"
                    type="password"
                    {...form.register("apiKey")}
                    error={form.formState.errors.apiKey?.message}
                  />
                </div>
              </div>
              {canGetModels ? (
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
                    getModels.mutate({ apiKey: form.getValues("apiKey") });
                  }}
                  disabled={getModels.isPending}
                >
                  {getModels.isPending ? "Checking..." : "Check API Key"}
                </Button>
              ) : null}
              {/* TODO: Add a short instructions to guide user to get the API key for each provider */}
            </div>
            {providers[provider.id].information.apiKeyInstructions}
          </div>
          {/* Model lists with search */}

          {canGetModels ? (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">Available Models</h2>
              <p className="text-sm text-gray-500">
                Enter your API key to fetch available models from {provider.name}
              </p>
              {models.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-8">
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="mt-2 text-sm text-gray-500">No models available</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      type="search"
                      placeholder="Search models..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10"
                    />
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Models Table */}
                  <div className="rounded-lg border border-gray-200">
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50">
                          <tr className="border-b border-gray-200">
                            <th className="w-8 p-3">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300"
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    modelFields.forEach((_, index) => {
                                      removeModel(index);
                                    });
                                    filteredModels.forEach((model) => {
                                      appendModel(model);
                                    });
                                  } else {
                                    form.setValue("models", []);
                                  }
                                }}
                              />
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900">
                              Name
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900">
                              Context Length
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900">
                              Price
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(filteredModels.length > 0 ? filteredModels : models).map((model) => (
                            <tr key={model.id} className="border-b border-gray-200">
                              <td className="p-3">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300"
                                  checked={form.watch("models").some((m) => m.id === model.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      appendModel(model);
                                    } else {
                                      const index = modelFields.findIndex(
                                        (m) => m.modelId === model.modelId,
                                      );
                                      if (index !== -1) {
                                        removeModel(index);
                                      }
                                    }
                                  }}
                                />
                              </td>
                              <td className="p-3">
                                <div className="flex flex-col">
                                  <span className="text-sm font-medium text-gray-900">
                                    {model.name}
                                  </span>
                                  <span className="text-sm text-gray-500">{model.id}</span>
                                </div>
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                {model.contextLength.toLocaleString()}
                              </td>
                              <td className="p-3 text-sm text-gray-900">
                                {model.pricePerMillionTokens &&
                                (model.pricePerMillionTokens.completion ||
                                  model.pricePerMillionTokens.prompt) ? (
                                  <div>
                                    ${model.pricePerMillionTokens.prompt}/1M input tokens
                                    <br />${model.pricePerMillionTokens.completion}/1M output tokens
                                  </div>
                                ) : (
                                  "Free"
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* No Results Message */}
                      {filteredModels.length === 0 && debouncedSearchTerm && (
                        <div className="p-8 text-center">
                          <p className="text-sm text-gray-500">
                            No models found matching "{debouncedSearchTerm}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label className="block text-sm font-medium text-gray-700">Model ID</Label>
                  <Input
                    type="text"
                    placeholder="e.g., ggml-gpt4all-j-v1.3-groovy.bin"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-1"
                    {...form.register("models.0.modelId")}
                  />
                  {providers[provider.id].information.getModelIdInstruction}
                </div>
                <div className="flex-1">
                  <Label className="block text-sm font-medium text-gray-700">Context Length</Label>
                  <Input
                    type="number"
                    // value={2048}
                    defaultValue={2048}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    {...form.register("models.0.contextLength", { valueAsNumber: true })}
                  />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium text-gray-700">
                  Price for Cost Estimation (Optional)
                </Label>
                <div className="flex space-x-4 mt-1">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="$ 0.00"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step={0.01}
                      defaultValue={0}
                      {...form.register("models.0.pricePerMillionTokens.prompt", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-gray-500">/1M input tokens</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="$ 0.00"
                      step={0.01}
                      defaultValue={0}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      {...form.register("models.0.pricePerMillionTokens.completion", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-gray-500">/1M output tokens</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Support Options */}
          <div className="space-y-4">
            <div>
              <button
                type="button"
                className="flex justify-between items-center w-full py-4 text-left"
                onClick={() => {
                  const el = document.getElementById("advanced-settings");
                  if (el) {
                    el.classList.toggle("max-h-0");
                    el.classList.toggle("max-h-[2000px]");
                    el.classList.toggle("opacity-0");
                    el.classList.toggle("opacity-100");
                    const arrow = el.previousElementSibling?.querySelector("svg");
                    if (arrow) {
                      arrow.classList.toggle("rotate-180");
                    }
                  }
                }}
              >
                <span className="text-lg font-semibold">Advanced Settings</span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                id="advanced-settings"
                className="max-h-0 opacity-0 overflow-hidden transition-all duration-700 ease-in-out"
              >
                {/* Support Options */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold">Model Capabilities</h3>
                  <Toggle
                    label="Support Plugins (via OpenAI Functions)"
                    description="Enable if the model supports the 'functions' or 'tool_calls' parameter."
                    checked={form.watch("supportPlugins")}
                    onChange={(checked) => form.setValue("supportPlugins", checked)}
                  />
                  <Toggle
                    label="Support OpenAI Vision"
                    description="Enable if the model supports image input."
                    checked={form.watch("supportVision")}
                    onChange={(checked) => form.setValue("supportVision", checked)}
                  />
                  <Toggle
                    label="Support System Role"
                    description='Enable if the model supports the "system" role.'
                    checked={form.watch("supportSystem")}
                    onChange={(checked) => form.setValue("supportSystem", checked)}
                  />
                  <Toggle
                    label="Support Streaming Output"
                    description='Enable if the model supports streaming output ("stream": true).'
                    checked={form.watch("supportStreaming")}
                    onChange={(checked) => form.setValue("supportStreaming", checked)}
                  />
                </div>

                {/* Custom Headers */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-semibold">Custom Headers</h3>
                  {headerFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                      <Input
                        placeholder="x-header-key"
                        className="flex-1"
                        {...form.register(`headers.${index}.key`)}
                        error={form.formState.errors.headers?.[index]?.key?.message}
                      />
                      <Input
                        placeholder="Header Value"
                        className="flex-1"
                        {...form.register(`headers.${index}.value`)}
                        error={form.formState.errors.headers?.[index]?.value?.message}
                      />
                      <Button
                        type="button"
                        variant="danger"
                        className="w-full sm:w-auto"
                        onClick={() => removeHeader(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-0 h-auto text-blue-500"
                    onClick={() => appendHeader({ key: "", value: "" })}
                  >
                    + Add Custom Headers
                  </Button>
                </div>

                {/* Custom Body Params */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Custom Body Params</h3>
                  {paramFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                      <select
                        className="rounded border p-2 w-full sm:w-auto"
                        {...form.register(`bodyParams.${index}.type`)}
                      >
                        <option value="string">string</option>
                        <option value="number">number</option>
                        <option value="boolean">boolean</option>
                        <option value="object">object</option>
                      </select>
                      <Input
                        placeholder="Key"
                        className="flex-1"
                        {...form.register(`bodyParams.${index}.key`)}
                        error={form.formState.errors.bodyParams?.[index]?.key?.message}
                      />
                      <Input
                        placeholder="Value"
                        className="flex-1"
                        {...form.register(`bodyParams.${index}.value`)}
                        error={form.formState.errors.bodyParams?.[index]?.value?.message}
                      />
                      <Button
                        type="button"
                        variant="danger"
                        className="w-full sm:w-auto"
                        onClick={() => removeParam(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    className="p-0 h-auto text-blue-500"
                    onClick={() => appendParam({ type: "string", key: "", value: "" })}
                  >
                    + Add Custom Body Params
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full m-0"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Adding..." : "Add Model"}
          </Button>
          {Object.entries(form.formState.errors)[0] && (
            <p className="mt-2 text-sm text-red-500">
              {Object.entries(form.formState.errors)[0][1]?.message}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}

// Sample data - move to a separate file in production
