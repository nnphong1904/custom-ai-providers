import { mistralAi } from "@/ai-providers/mistral-ai";
import { openRouter } from "@/ai-providers/open-router";
import { perplexity } from "@/ai-providers/perplexity";

export const providers = {
  [mistralAi.information.id]: mistralAi,
  [openRouter.information.id]: openRouter,
  [perplexity.information.id]: perplexity,
};
