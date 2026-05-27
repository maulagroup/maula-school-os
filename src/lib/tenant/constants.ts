export const RESERVED_SLUGS = [
  'www',
  'api',
  'admin',
  'platform',
  'login',
  'logout',
  'signup',
  'register',
  'dashboard',
  'portal',
  'ppdb',
  'lms',
  'static',
  'media',
  'assets',
  'root',
  'superadmin',
  'support',
  'system',
  'mail',
  'smtp',
  'cdn',
  'app',
];

export const SLUG_MAX_LENGTH = 50;
export const DOMAIN_MAX_LENGTH = 100;

export const i18nMessages = {
  schoolNameMin: 'School name must be at least 2 characters',
  slugMin: 'Slug must be at least 2 characters',
  slugMax: `Slug must be at most ${SLUG_MAX_LENGTH} characters`,
  slugFormat: 'Slug can only contain lowercase letters, numbers, and hyphens',
  slugReserved: 'This slug is not available',
  domainMin: 'Domain must be at least 2 characters',
  domainMax: `Domain must be at most ${DOMAIN_MAX_LENGTH} characters`,
  domainFormat: 'Please enter a valid domain or subdomain',
};
