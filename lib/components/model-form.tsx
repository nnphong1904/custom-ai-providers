import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/form/button";
import { Input } from "@/components/form/input";
import { Toggle } from "@/components/form/toggle";
import { modelFormSchema, type ModelFormData } from "@/schemas/model-form";
import { Provider, Model } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { providers } from "@/ai-providers";
import { buildModelConfigJson, JsonBuilderOutput } from "@/utils/json-builder";
import { Label } from "@/components/form/label";
import { ModelCapabilitiesDialog } from "@/components/model-capabilities-dialog";

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

  // const modelDefaultConfig = providers[provider.id].information.defaultConfig;

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
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-lg border border-gray-300 dark:border-gray-500">
          <img
            src={provider.icon}
            alt={`${provider.name} icon`}
            className="h-12 w-12 rounded-lg shadow-sm p-2 bg-white dark:bg-gray-900"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-[#ECECEC]">
              Add {provider.name} Model
            </h1>
            <p className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
              Configure your model settings and API credentials
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* API Key Input */}
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
          {/* Model lists with search */}

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
                      className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-[#ECECEC]/50"
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
                  <div className="rounded-lg border border-gray-300 dark:border-gray-500 overflow-hidden">
                    <div className="max-h-[400px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                          <tr className="border-b border-gray-300 dark:border-gray-500">
                            <th className="w-8 p-3">
                              <input
                                type="checkbox"
                                className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  if (isChecked) {
                                    modelFields.forEach((_, index) => {
                                      removeModel(index);
                                    });
                                    filteredModels.forEach((model) => {
                                      appendModel({
                                        ...model,
                                        supportedParams:
                                          model.supportedParams?.map((param) => ({
                                            key: param,
                                            enabled: true,
                                          })) || [],
                                      });
                                    });
                                  } else {
                                    form.setValue("models", []);
                                  }
                                }}
                              />
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                              Name
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                              Context Length
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                              Price
                            </th>
                            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                              Capabilities
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900">
                          {(filteredModels.length > 0 ? filteredModels : models).map(
                            (model, modelIndex) => (
                              <tr
                                key={model.id}
                                className="border-b border-gray-300 dark:border-gray-500"
                              >
                                <td className="p-3">
                                  <input
                                    type="checkbox"
                                    className="rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                    checked={form.watch("models").some((m) => m.id === model.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        appendModel({
                                          ...model,
                                          supportedParams:
                                            model.supportedParams?.map((param) => ({
                                              key: param,
                                              enabled: true,
                                            })) || [],
                                        });
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
                                    <span className="text-sm font-medium text-gray-900 dark:text-[#ECECEC]">
                                      {model.name}
                                    </span>
                                    <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
                                      {model.id}
                                    </span>
                                  </div>
                                </td>
                                <td className="p-3 text-sm text-gray-900 dark:text-[#ECECEC]">
                                  {model.contextLength.toLocaleString()}
                                </td>
                                <td className="p-3 text-sm text-gray-900 dark:text-[#ECECEC]">
                                  {model.pricePerMillionTokens &&
                                  (model.pricePerMillionTokens.completion ||
                                    model.pricePerMillionTokens.prompt) ? (
                                    <div>
                                      ${model.pricePerMillionTokens.prompt}/1M input tokens
                                      <br />${model.pricePerMillionTokens.completion}/1M output
                                      tokens
                                    </div>
                                  ) : (
                                    "Free"
                                  )}
                                </td>
                                <td className="p-3">
                                  {form.watch("models").some((m) => m.id === model.id) && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-[#ECECEC]/70">
                                      <p className="dark:text-[#ECECEC]">Auto detected</p>
                                      <ModelCapabilitiesDialog
                                        modelIndex={modelIndex}
                                        watch={form.watch}
                                        setValue={form.setValue}
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ),
                          )}
                        </tbody>
                      </table>

                      {/* No Results Message */}
                      {filteredModels.length === 0 && debouncedSearchTerm && (
                        <div className="p-8 text-center">
                          <p className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
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
                  <Label className="block text-sm font-medium text-gray-700 dark:text-[#ECECEC]">
                    Model ID
                  </Label>
                  <Input
                    type="text"
                    placeholder="e.g., ggml-gpt4all-j-v1.3-groovy.bin"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm mb-1"
                    {...form.register("models.0.modelId", {
                      onChange: (e) => {
                        const modelId = e.target.value;
                        const capabilities = providers[provider.id].detectCapabilities(modelId);
                        form.setValue("models.0.supportPlugins", capabilities.supportPlugins);
                        form.setValue("models.0.supportVision", capabilities.supportVision);
                        form.setValue("models.0.supportSystem", capabilities.supportSystem);
                        form.setValue("models.0.supportStreaming", capabilities.supportStreaming);
                        form.setValue("models.0.supportReasoning", capabilities.supportReasoning);
                        form.setValue(
                          "models.0.supportPromptCaching",
                          capabilities.supportPromptCaching,
                        );
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
                  <span className="text-gray-700 dark:text-[#ECECEC]">
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
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      step={0.01}
                      defaultValue={0}
                      {...form.register("models.0.pricePerMillionTokens.prompt", {
                        valueAsNumber: true,
                      })}
                    />
                    <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
                      /1M input tokens
                    </span>
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
                    <span className="text-sm text-gray-500 dark:text-[#ECECEC]/70">
                      /1M output tokens
                    </span>
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
                  onChange={(checked) =>
                    form.setValue("models.0.supportAssistantFirstMessage", checked)
                  }
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
                        className="h-4 w-4 rounded border-gray-300"
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
          )}

          {/* Support Options */}
          <div className="space-y-4">
            <div>
              <button
                type="button"
                className="flex gap-4 items-center py-4 text-left cursor-pointer transition-colors duration-200 hover:[&>span]:text-blue-500 hover:[&>svg]:stroke-blue-500"
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
                <span className="text-lg font-semibold dark:text-[#ECECEC] ">
                  Advanced Settings
                </span>
                <svg
                  className="w-5 h-5 transition-transform duration-300 transform dark:stroke-[#ECECEC] "
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
                {/* Custom Headers */}
                <div className="space-y-2 mb-6">
                  <h3 className="text-lg font-semibold dark:text-[#ECECEC]">Custom Headers</h3>
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
                    className="p-0 h-auto text-blue-500 dark:text-blue-400"
                    onClick={() => appendHeader({ key: "", value: "" })}
                  >
                    + Add Custom Headers
                  </Button>
                </div>

                {/* Custom Body Params */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold dark:text-[#ECECEC]">Custom Body Params</h3>
                  {paramFields.map((field, index) => (
                    <div key={field.id} className="flex flex-col sm:flex-row gap-3">
                      <select
                        className="rounded border p-2 w-full sm:w-auto dark:bg-gray-800 dark:border-gray-600 dark:text-[#ECECEC]"
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
                    className="p-0 h-auto text-blue-500 dark:text-blue-400"
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

// Sample data - move to a separate file in production
