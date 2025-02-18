import { providers } from "@/ai-providers";
import { AIProviderInformation, AIProviderName } from "@/ai-providers/type";
import { ModelFormData } from "@/schemas/model-form";
import { ModelConfig } from "@/types";
import { v4 as uuidv4 } from "uuid";

export type JsonBuilderInput = {
  userInput: ModelFormData;
  provider: AIProviderName;
};

export type JsonBuilderOutput = {
  userInput: ModelFormData;
  provider: Omit<
    AIProviderInformation,
    "defaultConfig" | "apiKeyInstructions" | "getModelIdInstruction"
  >;
  jsons: ModelConfig[];
};

export function buildModelConfigJson({ userInput, provider }: JsonBuilderInput): JsonBuilderOutput {
  const providerInfo = providers[provider];
  const jsons: ModelConfig[] = userInput.models.map((modelInfo) => {
    const defaultHeaders = providerInfo.buildDefaultHeaders(userInput.apiKey);
    return {
      // Basic Information
      title: modelInfo.name || modelInfo.modelId,
      description: modelInfo.description ?? "", // Can be extended if needed
      iconUrl: providerInfo.information.icon,
      endpoint: providerInfo.information.endpoint || userInput.endpoint,

      // IDs
      id: uuidv4(),
      modelID: modelInfo.modelId,

      // Provider Configuration
      // NOTE: This is a temporary value, we need to get the actual API type from the provider
      apiType: "openai",
      contextLength: modelInfo.contextLength,

      // Headers and Body Parameters
      headerRows: [...defaultHeaders, ...userInput.headers].map((header) => ({
        key: header.key,
        value: header.value,
      })),
      bodyRows: userInput.bodyParams.map((param) => ({
        key: param.key,
        value: param.value,
        type: param.type,
      })),

      // Capabilities supported
      pluginSupported: modelInfo.supportPlugins,
      visionSupported: modelInfo.supportVision,
      systemMessageSupported: modelInfo.supportSystem,
      streamOutputSupported: modelInfo.supportStreaming,
      reasoningSupported: modelInfo.supportReasoning,
      promptCachingSupported: modelInfo.supportPromptCaching,
      assistantFirstMessageSupported: modelInfo.supportAssistantFirstMessage,
      tokenEstimationSupported: modelInfo.supportTokenEstimation,

      supportedParams: modelInfo.supportedParams
        .filter((param) => param.enabled)
        .map((param) => param.key),

      // API Configuration
      // NOTE: This is a temporary value, we need to get the actual API key from the provider
      skipAPIKey: true,

      // Pricing
      pricePerMillionTokens: modelInfo.pricePerMillionTokens,
    };
  });
  return {
    userInput,
    provider: {
      endpoint: providerInfo.information.endpoint,
      id: providerInfo.information.id,
      name: providerInfo.information.name,
      icon: providerInfo.information.icon,
    },
    jsons,
  };
}
