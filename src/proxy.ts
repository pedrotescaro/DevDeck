import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Handle hybrid app / tracking actions from browser extensions to prevent console errors and 500s
  if (pathname.startsWith("/hybridaction/")) {
    const callback = request.nextUrl.searchParams.get("__callback__");
    if (callback) {
      return new NextResponse(`${callback}({});`, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
        },
        status: 200,
      });
    }
    return NextResponse.json({ success: true });
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/assets or public assets
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
