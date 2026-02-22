'use client';

import { PersianDatePicker, PersianDateRangePicker } from 'persian-date-kit';
import type { PersianDatePickerProps, PersianDateRangePickerProps } from 'persian-date-kit';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const prevIcon = <ChevronRightIcon className="size-4" />;
const nextIcon = <ChevronLeftIcon className="size-4" />;

const monthLabels = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

const weekdays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

const defaults = { prevIcon, nextIcon, monthLabels, weekdays };

function PersianDatePickerUI(props: PersianDatePickerProps) {
  return <PersianDatePicker {...defaults} {...props} />;
}

function PersianDateRangePickerUI(props: PersianDateRangePickerProps) {
  return <PersianDateRangePicker {...defaults} {...props} />;
}

export { PersianDatePickerUI as PersianDatePicker, PersianDateRangePickerUI as PersianDateRangePicker };
export type { PersianDatePickerProps, PersianDateRangePickerProps };
export type { PersianDateRange } from 'persian-date-kit';
