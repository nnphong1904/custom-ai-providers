import { MistralModelDTO } from "@/ai-providers/mistral-ai/types";
import { Model } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information = {
  id: "mistral-ai",
  name: "Mistral AI",
  endpoint: "https://api.mistral.ai/v1/chat/completions",
  icon: "https://docs.mistral.ai/img/logo.svg",
  defaultConfig: {
    supportPlugins: false,
    supportVision: false,
    supportSystem: true,
    supportStreaming: true,
  },
  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      You can sign up from{" "}
      <a href="https://mistral.ai/" className="font-bold">
        https://mistral.ai/
      </a>{" "}
      or another service that provide MistralAI models. Once you have an account, go to{" "}
      <a href="https://console.mistral.ai/user/api-keys/" className="font-bold">
        https://console.mistral.ai/user/api-keys/
      </a>{" "}
      to create an API key
    </p>
  ),
};

const getModels = async (apiKey: string): Promise<Model[]> => {
  const response = await fetch(`https://api.mistral.ai/v1/models`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });
  const data = (await response.json()) as { data: MistralModelDTO[] };
  const result = data.data.map((model) => ({
    id: model.id,
    modelId: model.id,
    name: model.name,
    description: model.description,
    contextLength: model.max_context_length,
    pricePerMillionTokens: null,
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
  ];
};

export const mistralAi = {
  information,
  getModels,
  buildDefaultHeaders,
};
