import { config } from "@/config";
import { isDevelopment } from "@/config/env";

export enum HostnameType {
  LOCALHOST = "localhost",
  PREVIEW = "preview",
  CENTRAL_DOMAIN = "central_domain",
  TENANT_SUBDOMAIN = "tenant_subdomain",
  TENANT_CUSTOM_DOMAIN = "tenant_custom_domain",
  PORTAL_SUBDOMAIN = "portal_subdomain",
  PPDB_SUBDOMAIN = "ppdb_subdomain",
  UNKNOWN_HOSTNAME = "unknown_hostname",
  INVALID_HOSTNAME = "invalid_hostname",
}

export interface HostnameResolution {
  type: HostnameType;
  hostname: string;
  normalizedHostname: string;
  tenantSubdomain?: string;
  tenantCustomDomain?: string;
  portalSubdomain?: string;
  ppdbSubdomain?: string;
}

export function normalizeHostname(hostname: string): string {
  return hostname
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "");
}

export function isPreviewDomain(hostname: string): boolean {
  const previewDomains = [
    "vercel.app",
    "preview.vercel.app",
    "localhost",
  ];
  return previewDomains.some((domain) => hostname.endsWith(domain));
}

export function isCentralDomain(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  return (
    normalized === config.tenant.rootDomain ||
    normalized === `www.${config.tenant.rootDomain}`
  );
}

export function isLocalhost(hostname: string): boolean {
  const normalized = normalizeHostname(hostname);
  return normalized === "localhost" || normalized.endsWith(".localhost");
}

export function extractSubdomainParts(hostname: string): string[] {
  const normalized = normalizeHostname(hostname);
  const rootDomain = normalizeHostname(config.tenant.rootDomain);
  
  if (!normalized.endsWith(rootDomain)) {
    return [];
  }
  
  const subdomainPart = normalized.slice(0, -rootDomain.length - 1);
  return subdomainPart.split(".");
}

export function resolveHostname(hostname: string): HostnameResolution {
  const normalizedHostname = normalizeHostname(hostname);

  if (!hostname || normalizedHostname.length === 0) {
    return {
      type: HostnameType.INVALID_HOSTNAME,
      hostname,
      normalizedHostname,
    };
  }

  if (isLocalhost(normalizedHostname)) {
    if (normalizedHostname === "localhost") {
      return {
        type: HostnameType.LOCALHOST,
        hostname,
        normalizedHostname,
      };
    }

    const parts = normalizedHostname.split(".");
    const subdomain = parts[0];

    if (subdomain === "portal") {
      return {
        type: HostnameType.PORTAL_SUBDOMAIN,
        hostname,
        normalizedHostname,
        portalSubdomain: subdomain,
      };
    }

    if (subdomain === "ppdb") {
      return {
        type: HostnameType.PPDB_SUBDOMAIN,
        hostname,
        normalizedHostname,
        ppdbSubdomain: subdomain,
      };
    }

    if (subdomain !== config.tenant.defaultSubdomain && subdomain !== "www") {
      return {
        type: HostnameType.TENANT_SUBDOMAIN,
        hostname,
        normalizedHostname,
        tenantSubdomain: subdomain,
      };
    }

    return {
      type: HostnameType.LOCALHOST,
      hostname,
      normalizedHostname,
    };
  }

  if (isPreviewDomain(normalizedHostname)) {
    return {
      type: HostnameType.PREVIEW,
      hostname,
      normalizedHostname,
    };
  }

  if (isCentralDomain(normalizedHostname)) {
    return {
      type: HostnameType.CENTRAL_DOMAIN,
      hostname,
      normalizedHostname,
    };
  }

  const subdomainParts = extractSubdomainParts(normalizedHostname);
  
  if (subdomainParts.length > 0) {
    if (subdomainParts[0] === "portal") {
      return {
        type: HostnameType.PORTAL_SUBDOMAIN,
        hostname,
        normalizedHostname,
        portalSubdomain: "portal",
        tenantSubdomain: subdomainParts.slice(1).join("."),
      };
    }

    if (subdomainParts[0] === "ppdb") {
      return {
        type: HostnameType.PPDB_SUBDOMAIN,
        hostname,
        normalizedHostname,
        ppdbSubdomain: "ppdb",
        tenantSubdomain: subdomainParts.slice(1).join("."),
      };
    }

    if (
      subdomainParts[0] !== config.tenant.defaultSubdomain &&
      subdomainParts[0] !== "www"
    ) {
      return {
        type: HostnameType.TENANT_SUBDOMAIN,
        hostname,
        normalizedHostname,
        tenantSubdomain: subdomainParts.join("."),
      };
    }
  }

  return {
    type: HostnameType.UNKNOWN_HOSTNAME,
    hostname,
    normalizedHostname,
  };
}

export function getTenantHostname(subdomain: string): string {
  if (isDevelopment) {
    return `${subdomain}.localhost`;
  }
  return `${subdomain}.${config.tenant.rootDomain}`;
}

export function getPortalHostname(subdomain: string): string {
  if (isDevelopment) {
    return `portal.${subdomain}.localhost`;
  }
  return `portal.${subdomain}.${config.tenant.rootDomain}`;
}

export function getPPDBHostname(subdomain: string): string {
  if (isDevelopment) {
    return `ppdb.${subdomain}.localhost`;
  }
  return `ppdb.${subdomain}.${config.tenant.rootDomain}`;
}
