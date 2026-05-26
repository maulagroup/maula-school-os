import { env } from "./env";

export const config = {
  app: {
    name: "Maula School OS",
    url: env.NEXT_PUBLIC_APP_URL,
  },
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  tenant: {
    defaultSubdomain: "app",
    rootDomain: env.NEXT_PUBLIC_ROOT_DOMAIN,
  },
};
