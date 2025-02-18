import { AIProviderInformation } from "@/ai-providers/type";
import { ModelCapabilities } from "@/types";
import { v4 as uuidv4 } from "uuid";
const information: AIProviderInformation = {
  id: "deepinfra",
  name: "DeepInfra",
  endpoint: "https://api.deepinfra.com/v1/openai/chat/completions",
  icon: "https://deepinfra.com/deepinfra-logo-64.webp",
  apiKeyInstructions: (
    <p className="text-sm text-gray-500">
      Go to{" "}
      <a href="https://deepinfra.com/" className="font-bold" target="_blank">
        https://deepinfra.com/
      </a>{" "}
      and Log into DeepInfra via your GitHub account. After logging in, go to{" "}
      <a href="https://deepinfra.com/dash/api_keys" className="font-bold" target="_blank">
        https://deepinfra.com/settings/api
      </a>{" "}
      to create your API key. Make sure to top up some money if needed.
    </p>
  ),
  getModelIdInstruction: (
    <p className="text-sm text-gray-500">
      You can find all model IDs{" "}
      <a href="https://deepinfra.com/models" className="font-bold underline" target="_blank">
        here
      </a>
    </p>
  ),
};

function detectCapabilities(modelId: string): ModelCapabilities {
  return {
    supportPlugins: [
      "meta-llama/Meta-Llama-3-70B-Instruct",
      "meta-llama/Meta-Llama-3.1-70B-Instruct",
      "meta-llama/Meta-Llama-3-8B-Instruct",
      "meta-llama/Meta-Llama-3.1-8B-Instruct",
      "meta-llama/Meta-Llama-3.1-405B-Instruct",
      "mistralai/Mixtral-8x22B-Instruct-v0.1",
      "mistralai/Mixtral-8x7B-Instruct-v0.1",
      "mistralai/Mistral-7B-Instruct-v0.1",
      "mistralai/Mistral-7B-Instruct-v0.3",
    ].includes(modelId),
    supportVision: [
      "meta-llama/Llama-3.2-90B-Vision-Instruct",
      "meta-llama/Llama-3.2-11B-Vision-Instruct",
      "Qwen/QVQ-72B-Preview",
    ].includes(modelId),
    supportSystem: true,
    supportStreaming: true,
    supportReasoning: false,
    supportPromptCaching: false,
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

export const deepInfra = {
  information,
  getModels: null,
  buildDefaultHeaders,
  detectCapabilities,
  testModel: "meta-llama/Meta-Llama-3-70B-Instruct",
};
