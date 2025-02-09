import { AIProviderInformation } from "@/ai-providers/type";
import { Model } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information: AIProviderInformation = {
  id: "perplexity",
  name: "Perplexity",
  endpoint: "https://api.perplexity.ai/chat/completions",
  icon: "https://images.seeklogo.com/logo-png/51/1/perplexity-ai-logo-png_seeklogo-517845.png",
  defaultConfig: {
    supportPlugins: false,
    supportVision: false,
    supportSystem: true,
    supportStreaming: true,
  },
  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      Go to{" "}
      <a href="https://www.perplexity.ai/" className="font-bold" target="_blank">
        https://www.perplexity.ai/
      </a>{" "}
      and sign up for an account. Then go to{" "}
      <a href="https://www.perplexity.ai/settings/api" className="font-bold" target="_blank">
        https://www.perplexity.ai/settings/api
      </a>{" "}
      to get your API key. Make sure to top up some money if needed.
    </p>
  ),
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getModels = async (_apiKey: string): Promise<Model[]> => {
  return [
    {
      id: "sonar-reasoning-pro",
      modelId: "sonar-reasoning-pro",
      name: "Sonar Reasoning Pro",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 2,
        completion: 8,
      },
    },
    {
      id: "sonar-reasoning",
      modelId: "sonar-reasoning",
      name: "Sonar Reasoning",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 1,
        completion: 5,
      },
    },
    {
      id: "sonar-pro",
      modelId: "sonar-pro",
      name: "Sonar Pro",
      description: "",
      contextLength: 200000,
      pricePerMillionTokens: {
        prompt: 3,
        completion: 15,
      },
    },
    {
      id: "sonar",
      modelId: "sonar",
      name: "Sonar",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 1,
        completion: 1,
      },
    },
    {
      id: "llama-3.1-sonar-small-128k-online",
      modelId: "llama-3.1-sonar-small-128k-online",
      name: "Llama 3.1 Sonar Small",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 0.2,
        completion: 0.2,
      },
    },
    {
      id: "llama-3.1-sonar-large-128k-online",
      modelId: "llama-3.1-sonar-large-128k-online",
      name: "Llama 3.1 Sonar Large",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 1,
        completion: 1,
      },
    },
    {
      id: "llama-3.1-sonar-huge-128k-online",
      modelId: "llama-3.1-sonar-huge-128k-online",
      name: "Llama 3.1 Sonar Huge",
      description: "",
      contextLength: 127000,
      pricePerMillionTokens: {
        prompt: 5,
        completion: 5,
      },
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

export const perplexity = {
  information,
  getModels,
  buildDefaultHeaders,
};
