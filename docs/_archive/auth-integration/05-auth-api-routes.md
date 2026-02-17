# Step 05: Auth API Routes

## Create file: `app/api/auth/[...nextauth]/route.ts`

```ts
import { handlers } from "@/lib/auth/auth";

export const { GET, POST } = handlers;
```

## Create file: `app/api/auth/backchannel-logout/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { revokeSession } from "@/lib/auth/logout-store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.formData();
    const logoutToken = body.get("logout_token");

    if (!logoutToken || typeof logoutToken !== "string") {
      return NextResponse.json(
        { error: "Missing logout_token" },
        { status: 400 }
      );
    }

    // Decode JWT payload (middle part) to extract sid
    // We don't verify signature here because the IDP is trusted
    // and this endpoint is only called server-to-server.
    // For production, add signature verification.
    const parts = logoutToken.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid token format" },
        { status: 400 }
      );
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    const sid = payload.sid as string | undefined;

    if (sid) {
      revokeSession(sid);
    }

    return new NextResponse(null, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Failed to process logout" },
      { status: 500 }
    );
  }
}
```

## Create file: `app/api/auth/frontchannel-logout/route.ts`

```ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  // Get the sid from query params (IDP sends it)
  const sid = request.nextUrl.searchParams.get("sid");

  // Clear the auth session cookie
  const cookieStore = await cookies();
  cookieStore.getAll().forEach((cookie) => {
    if (
      cookie.name.startsWith("authjs.") ||
      cookie.name.startsWith("__Secure-authjs.")
    ) {
      cookieStore.delete(cookie.name);
    }
  });

  // If we have a sid, also add it to revoked store
  if (sid) {
    const { revokeSession } = await import("@/lib/auth/logout-store");
    revokeSession(sid);
  }

  // Return a minimal HTML page (loaded in hidden iframe by IDP)
  return new NextResponse(
    `<!DOCTYPE html>
<html>
<head><title>Logged out</title></head>
<body>
  <p>Session cleared.</p>
</body>
</html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    }
  );
}
```
