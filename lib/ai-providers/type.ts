import { ReactNode } from "react";

export type AIProviderInformation = {
  id: string;
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
