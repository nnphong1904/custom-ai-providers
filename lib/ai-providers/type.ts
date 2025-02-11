import { ReactNode } from "react";

export type AIProviderName =
  | "mistral-ai"
  | "open-router"
  | "perplexity"
  | "deepinfra"
  | "deep-seek"
  | "hugging-face";

export type AIProviderInformation = {
  id: AIProviderName;
  name: string;
  endpoint: string;
  icon: string;
  defaultConfig: {
    supportPlugins: boolean;
    supportVision: boolean;
    supportSystem: boolean;
    supportStreaming: boolean;
  };
  apiKeyInstructions: ReactNode;
  getModelIdInstruction?: ReactNode;
};
