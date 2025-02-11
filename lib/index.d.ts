import { ReactNode } from "react";
import { JsonBuilderInput, JsonBuilderOutput } from "@/utils/json-builder";
import { ModelConfig } from "@/types";
import { AIProviderInformation } from "@/ai-providers/type";
export interface AIProvidersProps {
  /**
   * Callback function that receives the model configurations after form submission
   */
  onSave: (configs: JsonBuilderOutput[]) => void;
}

/**
 * Main component for AI provider configuration
 */
export function AIProviders(props: AIProvidersProps): ReactNode;

export function buildModelConfigJson(props: JsonBuilderInput): JsonBuilderOutput[];
export { ModelConfig, JsonBuilderInput, JsonBuilderOutput, AIProviderInformation };
