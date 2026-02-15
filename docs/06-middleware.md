# Step 06: Middleware (Route Protection)

## Create file: `middleware.ts` (in project root, next to `package.json`)

```ts
import { auth } from "@/lib/auth/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isLoggedIn = !!session;

  // Public paths that don't require auth
  const publicPaths = ["/login", "/api/auth"];
  const isPublicPath = publicPaths.some((path) =>
    nextUrl.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  // Not logged in -> redirect to login
  if (!isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Token refresh failed -> redirect to login
  if (session.error === "RefreshTokenError") {
    const loginUrl = new URL("/login", nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files (fonts, avatars, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|fonts|avatars).*)",
  ],
};
```
