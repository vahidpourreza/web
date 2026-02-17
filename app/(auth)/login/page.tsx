'use client';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderIcon } from 'lucide-react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn('duende-ids', { callbackUrl });
    } else if (status === 'authenticated') {
      if (session?.error === 'RefreshTokenError') {
        // Session was revoked (e.g. federated logout) — clear it and re-login
        signOut({ redirect: false }).then(() => {
          signIn('duende-ids', { callbackUrl });
        });
      } else {
        router.replace(callbackUrl);
      }
    }
  }, [status, session, callbackUrl, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
        <p className="text-sm text-muted-foreground">در حال انتقال به صفحه ورود...</p>
      </div>
    </div>
  );
}
