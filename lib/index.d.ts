import { ReactNode } from "react";

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
  pricePerMillionTokens?: {
    prompt?: number;
    completion?: number;
  } | null;
}

export interface AIProvidersProps {
  /**
   * Callback function that receives the model configurations after form submission
   */
  onSave: (configs: ModelConfig[]) => void;
}

/**
 * Main component for AI provider configuration
 */
export function AIProviders(props: AIProvidersProps): ReactNode;
