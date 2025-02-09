import { v4 as uuidv4 } from "uuid";
const information = {
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
