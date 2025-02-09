import { mistralAi } from "@/ai-providers/mistral-ai";
import { openRouter } from "@/ai-providers/open-router";
import { perplexity } from "@/ai-providers/perplexity";
import { deepInfra } from "@/ai-providers/deep-infra";
import { deepSeek } from "@/ai-providers/deep-seek";
import { huggingFaceAi } from "@/ai-providers/hugging-face";

export const providers = {
  [mistralAi.information.id]: mistralAi,
  [openRouter.information.id]: openRouter,
  [perplexity.information.id]: perplexity,
  [deepInfra.information.id]: deepInfra,
  [deepSeek.information.id]: deepSeek,
  [huggingFaceAi.information.id]: huggingFaceAi,
};
