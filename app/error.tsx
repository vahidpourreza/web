'use client';

import Link from 'next/link';
import { RotateCw } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-[10rem] leading-none font-bold tracking-tighter text-foreground/15 sm:text-[14rem]">
        500
      </h1>

      <div className="-mt-14 flex flex-col items-center gap-2 text-center sm:-mt-20">
        <p className="text-lg font-medium">خطایی رخ داد</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          مشکلی در بارگذاری این صفحه پیش آمد. لطفاً دوباره تلاش کنید.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button onClick={reset}>
          <RotateCw className="size-4" />
          تلاش مجدد
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/">بازگشت به داشبورد</Link>
        </Button>
      </div>

      <p className="text-xs text-muted-foreground/60" dir="ltr">
        {error.digest ? `شناسه پیگیری: ${error.digest}` : `خطا: ${error.message}`}
      </p>
    </div>
  );
}
