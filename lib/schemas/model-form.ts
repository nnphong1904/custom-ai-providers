import { z } from "zod";

export const modelCapabilitiesSchema = z.object({
  supportPlugins: z.boolean().default(false),
  supportVision: z.boolean().default(false),
  supportSystem: z.boolean().default(true),
  supportStreaming: z.boolean().default(true),
  supportReasoning: z.boolean().default(false),
  supportPromptCaching: z.boolean().default(false),
  supportAssistantFirstMessage: z.boolean().default(false),
  supportTokenEstimation: z.boolean().default(false),
});

export const modelFormSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  endpoint: z.string().url().min(1, "Endpoint is required"),
  headers: z
    .array(
      z.object({
        key: z.string().min(1, "Header key is required"),
        value: z.string().min(1, "Header value is required"),
      }),
    )
    .default([]),
  bodyParams: z
    .array(
      z.object({
        type: z.enum(["string", "number", "boolean", "object"]),
        key: z.string().min(1, "Parameter key is required"),
        value: z.string().min(1, "Parameter value is required"),
      }),
    )
    .default([]),
  models: z
    .array(
      z.object({
        id: z.string().optional(),
        modelId: z.string(),
        name: z.string().optional(),
        description: z.string().optional(),
        contextLength: z.number(),
        pricePerMillionTokens: z
          .object({
            prompt: z.number(),
            completion: z.number(),
          })
          .nullable(),
        ...modelCapabilitiesSchema.shape,
        supportedParams: z.array(
          z.object({
            key: z.string(),
            enabled: z.boolean().default(true),
          }),
        ),
      }),
    )
    .min(1, "At least one model is required")
    .default([]),
});

export type ModelFormData = z.infer<typeof modelFormSchema>;
