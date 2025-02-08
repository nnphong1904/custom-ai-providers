export type Provider = {
  id: string;
  name: string;
};

export type Model = {
  id: string;
  modelId: string;
  name: string;
  description: string;
  contextLength: number;
  pricePerMillionTokens: {
    prompt: number; //input per million tokens
    completion: number; //output per million tokens
  } | null;
};
