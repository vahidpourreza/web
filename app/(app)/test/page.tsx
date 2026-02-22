'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PersianDatePicker, PersianDateRangePicker } from '@/components/common/persian-datepicker';
import type { PersianDateRange } from '@/components/common/persian-datepicker';

function ErrorThrower(): never {
  throw new Error('خطایی در لود کردن صفحه تست پیش آمد');
}

export default function TestPage() {
  const [showError, setShowError] = useState(false);

  // Date picker states
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dateWithTime, setDateWithTime] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<PersianDateRange>({ start: null, end: null });
  const [multipleDates, setMultipleDates] = useState<Date[] | null>(null);
  const [inlineDate, setInlineDate] = useState<Date | null>(new Date());

  if (showError) {
    return <ErrorThrower />;
  }

  return (
    <div className="space-y-10 p-6">
      {/* Toast tests */}
      <section>
        <h2 className="mb-4 text-lg font-bold">تست Toast</h2>
        <div className="flex flex-wrap gap-3">
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
            Loading &rarr; Success
          </Button>
          <Button
            onClick={() => {
              const id = toast.loading('در حال ذخیره...');
              setTimeout(() => toast.error('خطا در ذخیره!', { id }), 2000);
            }}
          >
            Loading &rarr; Error
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
      </section>

      {/* Date Picker tests */}
      <section>
        <h2 className="mb-4 text-lg font-bold">تست تقویم شمسی</h2>
        <div className="space-y-8">
          {/* 1. Simple date picker */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">انتخاب تاریخ</h3>
            <PersianDatePicker
              value={singleDate}
              onChange={(d) => setSingleDate(d as Date | null)}
              placeholder="تاریخ را انتخاب کنید"
            />
            {singleDate && (
              <p className="text-xs text-muted-foreground">
                مقدار: {singleDate.toLocaleDateString('fa-IR')}
              </p>
            )}
          </div>

          {/* 2. Date + Time picker */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">انتخاب تاریخ و ساعت</h3>
            <PersianDatePicker
              value={dateWithTime}
              onChange={(d) => setDateWithTime(d as Date | null)}
              placeholder="تاریخ و ساعت را انتخاب کنید"
              timePicker={{ enabled: true, format: 'HH:mm' }}
            />
            {dateWithTime && (
              <p className="text-xs text-muted-foreground">
                مقدار: {dateWithTime.toLocaleDateString('fa-IR')} - {dateWithTime.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>

          {/* 3. Date range picker */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">انتخاب بازه تاریخ</h3>
            <PersianDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholderStart="از تاریخ"
              placeholderEnd="تا تاریخ"
            />
            {dateRange.start && dateRange.end && (
              <p className="text-xs text-muted-foreground">
                از {dateRange.start.toLocaleDateString('fa-IR')} تا {dateRange.end.toLocaleDateString('fa-IR')}
              </p>
            )}
          </div>

          {/* 4. Multiple date picker */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">انتخاب چند تاریخ</h3>
            <PersianDatePicker
              value={multipleDates}
              onChange={(d) => setMultipleDates(d as Date[])}
              placeholder="تاریخ‌ها را انتخاب کنید"
              multiple
              maxSelections={5}
            />
            {multipleDates && multipleDates.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {multipleDates.length} تاریخ انتخاب شده
              </p>
            )}
          </div>

          {/* 5. Date range picker (single input) */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">انتخاب بازه تاریخ (تک ورودی)</h3>
            <PersianDateRangePicker
              value={dateRange}
              onChange={setDateRange}
              inputVariant="single"
              placeholder="بازه تاریخ را انتخاب کنید"
            />
          </div>

          {/* 6. Inline calendar */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">تقویم درون‌خطی</h3>
            <PersianDatePicker
              value={inlineDate}
              onChange={(d) => setInlineDate(d as Date | null)}
              mode="inline"
            />
            {inlineDate && (
              <p className="text-xs text-muted-foreground">
                مقدار: {inlineDate.toLocaleDateString('fa-IR')}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
