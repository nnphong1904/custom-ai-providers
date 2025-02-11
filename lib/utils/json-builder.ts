import { providers } from "@/ai-providers";
import { AIProviderName } from "@/ai-providers/type";
import { ModelFormData } from "@/schemas/model-form";
import { ModelConfig } from "@/types";
import { v4 as uuidv4 } from "uuid";

interface JsonBuilderInput {
  userInput: ModelFormData;
  provider: AIProviderName;
}

export function buildModelConfigJson({ userInput, provider }: JsonBuilderInput): ModelConfig[] {
  const providerInfo = providers[provider];
  return userInput.models.map((modelInfo) => {
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

      // Feature Support
      pluginSupported: userInput.supportPlugins,
      visionSupported: userInput.supportVision,
      systemMessageSupported: userInput.supportSystem,
      streamOutputSupported: userInput.supportStreaming,

      // API Configuration
      // NOTE: This is a temporary value, we need to get the actual API key from the provider
      skipAPIKey: true,

      // Pricing
      pricePerMillionTokens: modelInfo.pricePerMillionTokens,
    };
  });
}
