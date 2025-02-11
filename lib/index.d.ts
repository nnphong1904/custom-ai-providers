import { ReactNode } from "react";
import { JsonBuilderInput } from "@/utils/json-builder";
import { ModelConfig } from "@/types";

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

export function buildModelConfigJson(props: JsonBuilderInput): ModelConfig[];
export { ModelConfig, JsonBuilderInput };
