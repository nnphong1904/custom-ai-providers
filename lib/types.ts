import { AIProviderName } from "@/ai-providers/type";

export type Provider = {
  id: AIProviderName;
  name: string;
  icon: string;
};

export type Model = {
  id: string;
  modelId: string;
  name: string;
  description: string;
  contextLength: number;
  pricePerMillionTokens: {
    prompt: number; //input per million tokens
    completion: number; //output per million tokens
  } | null;
};

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
