import { OpenRouterModelDTO } from "@/ai-providers/open-router/types";
import { AIProviderInformation } from "@/ai-providers/type";
import { Model, ModelCapabilities } from "@/types";
import { v4 as uuidv4 } from "uuid";
const supportedParams = [
  "temperature",
  "top_p",
  "stream",
  "presence_penalty",
  "frequency_penalty",
  "max_tokens",
  "include_reasoning",
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function detectCapabilities(_modelId: string): ModelCapabilities {
  return {
    supportPlugins: true,
    supportVision: true,
    supportSystem: true,
    supportStreaming: true,
    supportReasoning: true,
    supportPromptCaching: true,
    supportAssistantFirstMessage: false,
    supportTokenEstimation: false,
  };
}

const information: AIProviderInformation = {
  id: "open-router",
  name: "Open Router",
  endpoint: "https://openrouter.ai/api/v1/chat/completions",
  icon: "https://openrouter.ai/icon.png",

  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      Go to{" "}
      <a href="https://openrouter.ai/" className="font-bold" target="_blank">
        https://openrouter.ai/
      </a>{" "}
      and create an account. After signing up, go to{" "}
      <a href="https://openrouter.ai/keys" className="font-bold" target="_blank">
        https://openrouter.ai/keys
      </a>{" "}
      to create an API key. Make sure to top up some money if needed.
    </p>
  ),
};

const getModels = async (apiKey: string): Promise<Model[]> => {
  const response = await fetch(`https://openrouter.ai/api/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as { data: OpenRouterModelDTO[] };
  const result = data.data.map((model) => ({
    id: model.id,
    modelId: model.id,
    name: model.name,
    description: model.description,
    contextLength: model.context_length,
    pricePerMillionTokens: {
      prompt: Number((Number(model.pricing.prompt) * 1000000).toFixed(1)),
      completion: Number((Number(model.pricing.completion) * 1000000).toFixed(1)),
    },
    supportedParams,
    ...detectCapabilities(model.id),
  }));
  return result;
};

const buildDefaultHeaders = (apiKey: string) => {
  return [
    {
      id: uuidv4(),
      key: "Authorization",
      value: `Bearer ${apiKey}`,
    },
    {
      key: "X-Title",
      value: "TypingMind.com",
    },
    {
      key: "HTTP-Referer",
      value: "https://www.typingmind.com",
    },
  ];
};

export const openRouter = {
  information,
  getModels,
  buildDefaultHeaders,
  detectCapabilities,
};
