export enum RouteType {
  PUBLIC = "public",
  AUTH = "auth",
  PLATFORM_PORTAL = "platform_portal",
  TENANT_PORTAL = "tenant_portal",
  PPDB = "ppdb",
  API = "api",
}

export function getRouteType(pathname: string): RouteType {
  if (pathname === "/login") {
    return RouteType.AUTH;
  }
  if (pathname.startsWith("/api")) {
    return RouteType.API;
  }
  if (pathname.startsWith("/ppdb")) {
    return RouteType.PPDB;
  }
  if (pathname.startsWith("/platform")) {
    return RouteType.PLATFORM_PORTAL;
  }
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/portal")) {
    return RouteType.TENANT_PORTAL;
  }
  return RouteType.PUBLIC;
}

export function getRoleAwareRedirect(
  isPlatformAdmin: boolean,
  activeRoleCode?: string,
  hasValidMembership?: boolean
): string {
  console.log('[getRoleAwareRedirect] Input:', { isPlatformAdmin, activeRoleCode, hasValidMembership });

  if (isPlatformAdmin) {
    console.log('[getRoleAwareRedirect] Redirecting to /platform (platform admin)');
    return "/platform";
  }

  if (hasValidMembership || activeRoleCode) {
    console.log('[getRoleAwareRedirect] Redirecting to /portal (tenant user)');
    return "/portal";
  }

  console.log('[getRoleAwareRedirect] Redirecting to / (default)');
  return "/";
}
