import { mistralAi } from "@/ai-providers/mistral-ai";
import { openRouter } from "@/ai-providers/open-router";
import { perplexity } from "@/ai-providers/perplexity";
import { deepInfra } from "@/ai-providers/deep-infra";

export const providers = {
  [mistralAi.information.id]: mistralAi,
  [openRouter.information.id]: openRouter,
  [perplexity.information.id]: perplexity,
  [deepInfra.information.id]: deepInfra,
};
