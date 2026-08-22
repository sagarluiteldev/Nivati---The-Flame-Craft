import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") || request.nextUrl.host || "";

  // Allow admin access only on:
  // 1. Localhost & development environments (e.g. localhost:3000)
  // 2. Vercel deployment domains (e.g. *.vercel.app)
  // 3. Dedicated admin subdomains (e.g. admin.nivaticandles.com)
  const isAllowedAdminHost =
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes(".vercel.app") ||
    host.startsWith("admin.");

  // If someone tries to open /admin on the public main domain (e.g. nivaticandles.com), hide it with a 404
  if (!isAllowedAdminHost) {
    const notFoundUrl = new URL("/not-found", request.url);
    return NextResponse.rewrite(notFoundUrl, { status: 404 });
  }

  return updateSession(request);
}

export const config = {
  matcher: ["/admin/:path*"],
};
