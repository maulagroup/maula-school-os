import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { config as appConfig } from "@/config";
import { resolveUserAccess } from "@/lib/middleware/auth";
import { resolveActiveTenantFromHostname } from "@/lib/middleware/tenant";
import { getRouteType, RouteType, getRoleAwareRedirect } from "@/lib/middleware/route-access";

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const routeType = getRouteType(request.nextUrl.pathname);

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    appConfig.supabase.url,
    appConfig.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: any) {
          cookiesToSet.forEach((cookie: any) =>
            response.cookies.set(cookie.name, cookie.value, cookie.options)
          );
        },
      },
    }
  );

  const userAccess = await resolveUserAccess(supabase);
  const url = request.nextUrl.clone();

  if (routeType === RouteType.AUTH && userAccess.isAuthenticated) {
    const redirectPath = getRoleAwareRedirect(
      userAccess.isPlatformAdmin,
      userAccess.activeRoleCode
    );
    url.pathname = redirectPath;
    return NextResponse.redirect(url);
  }

  const requiresAuth =
    routeType === RouteType.TENANT_PORTAL ||
    routeType === RouteType.PLATFORM_PORTAL ||
    routeType === RouteType.PPDB;

  if (requiresAuth && !userAccess.isAuthenticated) {
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (requiresAuth && !userAccess.hasValidMembership) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  if (routeType === RouteType.PLATFORM_PORTAL && !userAccess.isPlatformAdmin) {
    url.pathname = "/forbidden";
    return NextResponse.redirect(url);
  }

  const tenantFromHostname = await resolveActiveTenantFromHostname(
    hostname,
    supabase
  );

  if (tenantFromHostname) {
    response.headers.set("x-tenant-id", tenantFromHostname.tenantId);
    response.headers.set("x-tenant-status", tenantFromHostname.tenantStatus);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|json)$).*)",
  ],
};
