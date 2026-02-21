'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 px-4">
      <h1 className="text-[10rem] leading-none font-bold tracking-tighter text-foreground/15 sm:text-[14rem]">
        404
      </h1>

      <div className="-mt-14 flex flex-col items-center gap-2 text-center sm:-mt-20">
        <p className="text-lg font-medium">صفحه پیدا نشد</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          آدرسی که وارد کردید وجود ندارد یا جابجا شده است.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button asChild>
          <Link href="/">بازگشت به داشبورد</Link>
        </Button>
        <Button variant="ghost" onClick={() => window.history.back()}>
          صفحه قبل
          <ArrowLeft className="size-4" />
        </Button>
      </div>
    </div>
  );
}
