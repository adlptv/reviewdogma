import { z } from "zod";

export const policyCreateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z0-9\s\-_]+$/, "Name can only contain letters, numbers, spaces, hyphens, and underscores"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
  rules: z
    .string()
    .min(1, "Rules YAML is required")
    .max(10000, "Rules must be less than 10000 characters"),
  enabled: z.boolean().default(true),
});

export const policyUpdateSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .optional(),
  rules: z
    .string()
    .min(1, "Rules YAML is required")
    .max(10000, "Rules must be less than 10000 characters")
    .optional(),
  enabled: z.boolean().optional(),
});

export const validatePolicySchema = z.object({
  rules: z.string().min(1, "Rules YAML is required"),
});

export const analyzeSchema = z.object({
  repo: z
    .string()
    .min(1, "Repository is required")
    .max(200, "Repository name too long")
    .regex(/^[a-zA-Z0-9\-_/.]+$/, "Invalid repository name"),
  prNumber: z.number().int().positive("PR number must be positive"),
  diff: z.string().min(1, "Diff is required").max(1000000, "Diff too large"),
  fileTypes: z.array(z.string()).optional(),
});

export const webhookPayloadSchema = z.object({
  action: z.string(),
  pull_request: z
    .object({
      number: z.number(),
      title: z.string(),
      body: z.string().nullable().optional(),
      head: z.object({
        sha: z.string(),
        ref: z.string(),
      }),
      base: z.object({
        sha: z.string(),
        ref: z.string(),
      }),
    })
    .optional(),
  repository: z
    .object({
      full_name: z.string(),
      name: z.string(),
    })
    .optional(),
});

export const marketplacePolicySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  rules: z.string().min(1),
  category: z.string().min(1),
  author: z.string().min(1),
  downloads: z.number().int().nonnegative().default(0),
  rating: z.number().min(0).max(5).default(0),
});

export type PolicyCreateInput = z.infer<typeof policyCreateSchema>;
export type PolicyUpdateInput = z.infer<typeof policyUpdateSchema>;
export type AnalyzeInput = z.infer<typeof analyzeSchema>;
export type WebhookPayload = z.infer<typeof webhookPayloadSchema>;
