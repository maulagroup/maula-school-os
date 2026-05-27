import { z } from 'zod';
import {
  RESERVED_SLUGS,
  SLUG_MAX_LENGTH,
  DOMAIN_MAX_LENGTH,
  i18nMessages,
} from './constants';

export function generateSlugFromSchoolName(schoolName: string): string {
  return schoolName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, SLUG_MAX_LENGTH);
}

export function normalizeSlug(slug: string): string {
  return slug.toLowerCase().trim();
}

export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim();
}

export function validateSlug(slug: string): { valid: boolean; error?: string } {
  const normalized = normalizeSlug(slug);

  if (normalized.length < 2) {
    return { valid: false, error: i18nMessages.slugMin };
  }

  if (normalized.length > SLUG_MAX_LENGTH) {
    return { valid: false, error: i18nMessages.slugMax };
  }

  if (!/^[a-z0-9-]+$/.test(normalized)) {
    return { valid: false, error: i18nMessages.slugFormat };
  }

  if (RESERVED_SLUGS.includes(normalized)) {
    return { valid: false, error: i18nMessages.slugReserved };
  }

  return { valid: true };
}

export function validateDomain(domain: string): { valid: boolean; error?: string } {
  const normalized = normalizeDomain(domain);

  if (normalized.length < 2) {
    return { valid: false, error: i18nMessages.domainMin };
  }

  if (normalized.length > DOMAIN_MAX_LENGTH) {
    return { valid: false, error: i18nMessages.domainMax };
  }

  const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/;
  if (!domainRegex.test(normalized)) {
    return { valid: false, error: i18nMessages.domainFormat };
  }

  return { valid: true };
}

export const createTenantSchema = z.object({
  name: z.string().min(2, { message: i18nMessages.schoolNameMin }),
  slug: z
    .string()
    .min(2, { message: i18nMessages.slugMin })
    .max(SLUG_MAX_LENGTH, { message: i18nMessages.slugMax })
    .refine(
      (slug) => {
        const validation = validateSlug(slug);
        return validation.valid;
      },
      (slug) => {
        const validation = validateSlug(slug);
        return { message: validation.error || i18nMessages.slugFormat };
      }
    ),
  domain: z
    .string()
    .min(2, { message: i18nMessages.domainMin })
    .max(DOMAIN_MAX_LENGTH, { message: i18nMessages.domainMax })
    .refine(
      (domain) => {
        const validation = validateDomain(domain);
        return validation.valid;
      },
      (domain) => {
        const validation = validateDomain(domain);
        return { message: validation.error || i18nMessages.domainFormat };
      }
    ),
});

export type CreateTenantInput = z.infer<typeof createTenantSchema>;
