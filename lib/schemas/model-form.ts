import { z } from "zod";

export const modelFormSchema = z.object({
  apiKey: z.string().min(1, "API Key is required"),
  supportPlugins: z.boolean().default(false),
  supportVision: z.boolean().default(false),
  supportSystem: z.boolean().default(true),
  supportStreaming: z.boolean().default(true),
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
        id: z.string(),
        modelId: z.string(),
        name: z.string(),
        description: z.string().optional(),
        contextLength: z.number(),
        pricePerMillionTokens: z
          .object({
            prompt: z.number(),
            completion: z.number(),
          })
          .nullable(),
      }),
    )
    .default([]),
});

export type ModelFormData = z.infer<typeof modelFormSchema>;
