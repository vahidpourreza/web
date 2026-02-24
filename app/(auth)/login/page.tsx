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
        signOut({ redirect: false }).then(() => {
          signIn('duende-ids', { callbackUrl });
        });
      } else {
        router.replace(callbackUrl);
      }
    }
  }, [status, session, callbackUrl, router]);

  return (
    <div className="fixed inset-0 bg-background overflow-hidden">
      <div
        className="absolute inset-0 dark:opacity-100 opacity-40"
        style={{
          animation: 'pulse1 3s ease-in-out infinite backwards',
        }}
      >
        <div
          className="absolute"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background:
              'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 70%)',
          }}
        />
      </div>
      <div
        className="absolute inset-0 dark:opacity-100 opacity-40"
        style={{
          animation: 'pulse2 4s ease-in-out infinite 1s backwards',
        }}
      >
        <div
          className="absolute"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background:
              'radial-gradient(circle at 50% 50%, var(--destructive) 0%, transparent 60%)',
          }}
        />
      </div>
      <div
        className="absolute inset-0 dark:opacity-100 opacity-40"
        style={{
          animation: 'pulse3 3.5s ease-in-out infinite 0.5s backwards',
        }}
      >
        <div
          className="absolute"
          style={{
            width: '200%',
            height: '200%',
            top: '-50%',
            left: '-50%',
            background:
              'radial-gradient(circle at 50% 50%, var(--primary) 0%, transparent 50%)',
          }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center" style={{ filter: 'blur(0.5px)' }}>
        <LoaderIcon className="size-10 animate-spin text-foreground/15 drop-shadow-lg" strokeWidth={1.5} />
      </div>
      <style>{`
        @keyframes pulse1 {
          0% { transform: scale(2.2); opacity: 0.05; }
          50% { transform: scale(1); opacity: 0.2; }
          100% { transform: scale(2.2); opacity: 0.05; }
        }
        @keyframes pulse2 {
          0% { transform: scale(2); opacity: 0.04; }
          50% { transform: scale(0.8); opacity: 0.15; }
          100% { transform: scale(2); opacity: 0.04; }
        }
        @keyframes pulse3 {
          0% { transform: scale(2.5); opacity: 0.03; }
          50% { transform: scale(1.2); opacity: 0.12; }
          100% { transform: scale(2.5); opacity: 0.03; }
        }
      `}</style>
    </div>
  );
}
