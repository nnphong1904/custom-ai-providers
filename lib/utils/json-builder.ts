import { ModelFormData } from "@/schemas/model-form";
import { v4 as uuidv4 } from "uuid";

interface PricePerMillionTokens {
  prompt?: number;
  completion?: number;
}

export interface ModelConfig {
  title: string;
  description: string;
  iconUrl: string;
  endpoint: string;
  id: string;
  modelID: string;
  apiType: "openai" | "anthropic" | "custom";
  contextLength: number;
  headerRows: Array<{ key: string; value: string }>;
  bodyRows: Array<{ key: string; value: string; type: string }>;
  pluginSupported: boolean;
  visionSupported: boolean;
  systemMessageSupported: boolean;
  streamOutputSupported: boolean;
  skipAPIKey: boolean;
  pricePerMillionTokens?: PricePerMillionTokens | null;
}

interface JsonBuilderInput {
  formData: ModelFormData;
  modelInfo: {
    name: string;
    id: string;
    contextLength: number;
    description?: string;
    pricePerMillionTokens?: {
      prompt?: number;
      completion?: number;
    } | null;
  };
  providerInfo: {
    endpoint: string;
    iconUrl: string;
    apiType: "openai" | "anthropic" | "custom";
    skipAPIKey?: boolean;
  };
}

export function buildModelConfigJson({
  formData,
  modelInfo,
  providerInfo,
}: JsonBuilderInput): ModelConfig {
  return {
    // Basic Information
    title: modelInfo.name,
    description: modelInfo.description ?? "", // Can be extended if needed
    iconUrl: providerInfo.iconUrl,
    endpoint: providerInfo.endpoint,

    // IDs
    id: uuidv4(),
    modelID: modelInfo.id,

    // Provider Configuration
    apiType: providerInfo.apiType,
    contextLength: modelInfo.contextLength,

    // Headers and Body Parameters
    headerRows: formData.headers.map((header) => ({
      key: header.key,
      value: header.value,
    })),
    bodyRows: formData.bodyParams.map((param) => ({
      key: param.key,
      value: param.value,
      type: param.type,
    })),

    // Feature Support
    pluginSupported: formData.supportPlugins,
    visionSupported: formData.supportVision,
    systemMessageSupported: formData.supportSystem,
    streamOutputSupported: formData.supportStreaming,

    // API Configuration
    skipAPIKey: providerInfo.skipAPIKey ?? false,

    // Pricing
    pricePerMillionTokens: modelInfo.pricePerMillionTokens,
  };
}
