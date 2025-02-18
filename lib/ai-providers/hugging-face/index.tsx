import { AIProviderInformation } from "@/ai-providers/type";
import { ModelCapabilities } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information: AIProviderInformation = {
  id: "hugging-face",
  name: "Hugging Face",
  endpoint: "",
  icon: "https://custom.typingmind.com/assets/models/huggingface.png",
  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      You should follow this{" "}
      <a
        href="https://docs.typingmind.com/chat-models-settings/use-with-hugging-face-models"
        className="font-bold"
        target="_blank"
      >
        instructions
      </a>{" "}
      to know how to get needed information
    </p>
  ),
  getModelIdInstruction: (
    <p className="text-sm text-gray-500">
      You should follow this{" "}
      <a
        href="https://docs.typingmind.com/chat-models-settings/use-with-hugging-face-models"
        target="_blank"
        className="font-bold"
      >
        instructions
      </a>{" "}
      to know how to get needed information
    </p>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function detectCapabilities(_modelId: string): ModelCapabilities {
  return {
    supportPlugins: true,
    supportVision: true,
    supportSystem: true,
    supportStreaming: true,
    supportReasoning: false,
    supportPromptCaching: true,
    supportAssistantFirstMessage: false,
    supportTokenEstimation: false,
  };
}

const buildDefaultHeaders = (apiKey: string) => {
  return [
    {
      id: uuidv4(),
      key: "Authorization",
      value: `Bearer ${apiKey}`,
    },
  ];
};

export const huggingFaceAi = {
  information,
  getModels: null,
  buildDefaultHeaders,
  detectCapabilities,
};
