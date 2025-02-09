import { AIProviderInformation } from "@/ai-providers/type";
import { v4 as uuidv4 } from "uuid";
const information: AIProviderInformation = {
  id: "DeepInfra",
  name: "DeepInfra",
  endpoint: "https://api.deepinfra.com/v1/openai/chat/completions",
  icon: "",
  defaultConfig: {
    supportPlugins: false,
    supportVision: false,
    supportSystem: true,
    supportStreaming: true,
  },
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
};
