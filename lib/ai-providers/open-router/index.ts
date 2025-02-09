import { OpenRouterModelDTO } from "@/ai-providers/open-router/types";
import { Model } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information = {
  id: "open-router",
  name: "Open Router",
  endpoint: "https://openrouter.ai/api/v1/completions",
  icon: "https://openrouter.ai/icon.png",
  defaultConfig: {
    supportPlugins: true,
    supportVision: true,
    supportSystem: true,
    supportStreaming: true,
  },
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
};
