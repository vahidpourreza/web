# Step 11: Login Page

## Create file: `app/(auth)/login/page.tsx`

The `(auth)` folder uses Next.js route group — no extra `/auth` in the URL. The login page lives at `/login`.

```tsx
"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderIcon } from "lucide-react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("duende-ids", { callbackUrl });
    } else if (status === "authenticated") {
      router.replace(callbackUrl);
    }
  }, [status, callbackUrl, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          در حال انتقال به صفحه ورود...
        </p>
      </div>
    </div>
  );
}
```

This page:
1. If not authenticated: auto-redirects to the IDP login page
2. If already authenticated: redirects back to the original page (or `/`)
3. Shows a loading spinner while redirecting
