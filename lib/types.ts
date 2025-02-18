import { AIProviderName } from "@/ai-providers/type";
import { modelCapabilitiesSchema } from "@/schemas/model-form";
import z from "zod";

export type Provider = {
  id: AIProviderName;
  name: string;
  icon: string;
};

export type ModelCapabilities = z.infer<typeof modelCapabilitiesSchema>;

export type Model = {
  id: string;
  modelId: string;
  supportedParams: string[];
  name: string;
  description: string;
  contextLength: number;
  pricePerMillionTokens: {
    prompt: number; //input per million tokens
    completion: number; //output per million tokens
  } | null;
} & ModelCapabilities;

interface PricePerMillionTokens {
  prompt?: number;
  completion?: number;
}

export type ModelConfig = {
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
  supportedParams: string[];
  skipAPIKey: boolean;
  pricePerMillionTokens?: PricePerMillionTokens | null;
};
