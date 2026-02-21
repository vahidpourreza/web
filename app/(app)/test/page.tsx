'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

function ErrorThrower(): never {
  throw new Error('خطایی در لود کردن صفحه تست پیش آمد');
}

export default function TestPage() {
  const [showError, setShowError] = useState(false);

  if (showError) {
    return <ErrorThrower />;
  }

  return (
    <div className="flex flex-wrap gap-3 p-6">
      <Button onClick={() => toast.success('عملیات با موفقیت انجام شد')}>Success</Button>
      <Button onClick={() => toast.error('خطایی رخ داده است')}>Error</Button>
      <Button onClick={() => toast.warning('هشدار: اطلاعات ذخیره نشده')}>Warning</Button>
      <Button onClick={() => toast.info('اطلاعات جدید موجود است')}>Info</Button>
      <Button onClick={() => toast.loading('در حال بارگذاری...')}>Loading</Button>
      <Button
        onClick={() => {
          const id = toast.loading('در حال ذخیره...');
          setTimeout(() => toast.success('ذخیره شد!', { id }), 2000);
        }}
      >
        Loading → Success
      </Button>
      <Button
        onClick={() => {
          const id = toast.loading('در حال ذخیره...');
          setTimeout(() => toast.error('خطا در ذخیره!', { id }), 2000);
        }}
      >
        Loading → Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.success('موفق');
          toast.error('خطا');
          toast.warning('هشدار');
          toast.info('اطلاعات');
        }}
      >
        All at once
      </Button>

      <Button variant="destructive" onClick={() => setShowError(true)}>
        Throw Error
      </Button>

      <Button
        variant="outline"
        onClick={() =>
          toast('رخداد ایجاد شد', {
            description: 'شنبه, 03 فروردین 1406 در 9:00 صبح',
            action: {
              label: 'بازگشت',
              onClick: () => console.log('Undo'),
            },
          })
        }
      >
        Show Toast
      </Button>
    </div>
  );
}
