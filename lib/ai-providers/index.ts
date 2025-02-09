import { mistralAi } from "@/ai-providers/mistral-ai";
import { openRouter } from "@/ai-providers/open-router";

export const providers = {
  [mistralAi.information.id]: mistralAi,
  [openRouter.information.id]: openRouter,
};
