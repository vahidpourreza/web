'use client';
import { useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoaderIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex min-h-screen items-center justify-center bg-muted/40">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="items-center text-center">
          <CardTitle className="text-base">حساب کاربری</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 py-8">
          <LoaderIcon className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">در حال بررسی احراز هویت...</p>
        </CardContent>
      </Card>
    </div>
  );
}
