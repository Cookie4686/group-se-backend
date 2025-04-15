import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isProtectedPage } from "./utils";

export default function middleware(req: NextRequest) {
  if (isProtectedPage(req.nextUrl.pathname)) {
    return authMiddleware(req, { params: undefined });
  }
  return NextResponse.next();
}

const authMiddleware = auth((req) => {
  const isLoggedIn = !!req.auth;
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${req.nextUrl.href}`, req.nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
