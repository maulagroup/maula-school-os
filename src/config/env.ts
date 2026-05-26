import { z } from "zod";

const nodeEnvSchema = z.enum(["development", "test", "production", "preview"], {
  errorMap: () => ({ message: "NODE_ENV must be one of: development, test, production, preview" }),
}).default("development");

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url({
    message: "NEXT_PUBLIC_SUPABASE_URL must be a valid URL",
  }).optional().default("https://example.supabase.co"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, {
    message: "NEXT_PUBLIC_SUPABASE_ANON_KEY is required",
  }).optional().default("dummy-key"),
  NEXT_PUBLIC_APP_URL: z.string().url({
    message: "NEXT_PUBLIC_APP_URL must be a valid URL",
  }).default("http://localhost:3000"),
  NEXT_PUBLIC_ROOT_DOMAIN: z.string().min(1, {
    message: "NEXT_PUBLIC_ROOT_DOMAIN is required for tenant architecture",
  }).optional().default("localhost"),
});

const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, {
    message: "SUPABASE_SERVICE_ROLE_KEY is required",
  }).optional().default("dummy-key"),
  NODE_ENV: nodeEnvSchema,
});

const NODE_ENV = nodeEnvSchema.parse(process.env.NODE_ENV);

const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_ROOT_DOMAIN: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
});

const serverEnv = serverEnvSchema.parse({
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  NODE_ENV: NODE_ENV,
});

export const env = {
  ...publicEnv,
  ...serverEnv,
};

export const isDevelopment = NODE_ENV === "development";
export const isProduction = NODE_ENV === "production";
export const isTest = NODE_ENV === "test";
export const isPreview = NODE_ENV === "preview" || 
  (typeof process.env.VERCEL_ENV !== "undefined" && process.env.VERCEL_ENV === "preview");
