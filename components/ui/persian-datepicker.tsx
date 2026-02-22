'use client';

import { PersianDatePicker, PersianDateRangePicker } from 'persian-date-kit';
import type { PersianDatePickerProps, PersianDateRangePickerProps } from 'persian-date-kit';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const prevIcon = <ChevronRightIcon className="size-4" />;
const nextIcon = <ChevronLeftIcon className="size-4" />;

function PersianDatePickerUI(props: PersianDatePickerProps) {
  return <PersianDatePicker prevIcon={prevIcon} nextIcon={nextIcon} {...props} />;
}

function PersianDateRangePickerUI(props: PersianDateRangePickerProps) {
  return <PersianDateRangePicker prevIcon={prevIcon} nextIcon={nextIcon} {...props} />;
}

export { PersianDatePickerUI as PersianDatePicker, PersianDateRangePickerUI as PersianDateRangePicker };
export type { PersianDatePickerProps, PersianDateRangePickerProps };
export type { PersianDateRange } from 'persian-date-kit';
