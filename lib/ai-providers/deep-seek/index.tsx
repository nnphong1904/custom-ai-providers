import { AIProviderInformation } from "@/ai-providers/type";
import { Model, ModelCapabilities } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information: AIProviderInformation = {
  id: "deep-seek",
  name: "DeepSeek",
  endpoint: "https://api.deepseek.com/v1/chat/completions",
  icon: "https://custom.typingmind.com/assets/models/deepseek.png",
  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      First, you will need to sign up for a DeepSeek AI account at
      <a href="https://platform.deepseek.com/sign_in" className="font-bold" target="_blank">
        https://platform.deepseek.com/sign_in
      </a>
      . And then go to
      <a href="https://platform.deepseek.com/api_keys" className="font-bold" target="_blank">
        https://platform.deepseek.com/api_keys
      </a>{" "}
      to create a new API key. Make sure to top up some money if needed.
    </p>
  ),
};

function detectCapabilities(modelId: string): ModelCapabilities {
  return {
    supportPlugins: true,
    supportVision: false,
    supportSystem: true,
    supportStreaming: true,
    supportReasoning: modelId === "deepseek-reasoner",
    supportPromptCaching: true,
    supportAssistantFirstMessage: false,
    supportTokenEstimation: false,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getModels = async (_apiKey: string): Promise<Model[]> => {
  return [
    {
      id: "deepseek-chat",
      modelId: "deepseek-chat",
      name: "DeepSeek Chat",
      description: "",
      contextLength: 64000,
      pricePerMillionTokens: {
        prompt: 0.27,
        completion: 1.1,
      },
      supportedParams: [
        "frequency_penalty",
        "presence_penalty",
        "max_tokens",
        "stream",
        "top_p",
        "temperature",
      ],
      ...detectCapabilities("deepseek-chat"),
    },
    {
      id: "deepseek-reasoner",
      modelId: "deepseek-reasoner",
      name: "DeepSeek Reasoner",
      description: "",
      contextLength: 64000,
      pricePerMillionTokens: {
        prompt: 0.55,
        completion: 2.19,
      },
      supportedParams: ["max_tokens", "stream", "reasoning_effort"],
      ...detectCapabilities("deepseek-reasoner"),
    },
  ];
};

const buildDefaultHeaders = (apiKey: string) => {
  return [
    {
      id: uuidv4(),
      key: "Authorization",
      value: `Bearer ${apiKey}`,
    },
  ];
};

export const deepSeek = {
  information,
  getModels,
  buildDefaultHeaders,
  detectCapabilities,
  testModel: "deepseek-chat",
};
