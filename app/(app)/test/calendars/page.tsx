'use client';

import * as React from 'react';
import { useState } from 'react';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { addDays, format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, Clock2Icon } from 'lucide-react';
import { type DateRange } from 'react-day-picker';

// ─── Helpers ────────────────────────────────────────────────────────
function formatDatePersian(date: Date | undefined) {
  if (!date) return '';
  return date.toLocaleDateString('fa-IR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

// ─── Section wrapper ────────────────────────────────────────────────
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className="flex flex-wrap items-start gap-6">{children}</div>
    </section>
  );
}

// ─── Page ───────────────────────────────────────────────────────────
export default function CalendarsTestPage() {
  // Calendar states
  const [basicDate, setBasicDate] = useState<Date | undefined>(undefined);
  const [captionDate, setCaptionDate] = useState<Date | undefined>(undefined);
  const [rangeDate, setRangeDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 12),
    to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  });
  const [weekNumDate, setWeekNumDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );
  const [presetDate, setPresetDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 12),
  );
  const [presetMonth, setPresetMonth] = useState<Date>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [timeDate, setTimeDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), new Date().getMonth(), 12),
  );
  const [bookedDate, setBookedDate] = useState<Date | undefined>(
    new Date(new Date().getFullYear(), 1, 3),
  );
  const bookedDates = Array.from(
    { length: 15 },
    (_, i) => new Date(new Date().getFullYear(), 1, 12 + i),
  );
  const [customRange, setCustomRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 11, 8),
    to: addDays(new Date(new Date().getFullYear(), 11, 8), 10),
  });

  // DatePicker states
  const [dpDemo, setDpDemo] = useState<Date | undefined>(undefined);
  const [dpSimple, setDpSimple] = useState<Date | undefined>(undefined);
  const [dpRange, setDpRange] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), 0, 20),
    to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  });
  const [dpDob, setDpDob] = useState<Date | undefined>(undefined);
  const [dpDobOpen, setDpDobOpen] = useState(false);

  const [dpInputOpen, setDpInputOpen] = useState(false);
  const [dpInputDate, setDpInputDate] = useState<Date | undefined>(
    new Date('2025-06-01'),
  );
  const [dpInputMonth, setDpInputMonth] = useState<Date | undefined>(
    new Date('2025-06-01'),
  );
  const [dpInputValue, setDpInputValue] = useState(
    formatDatePersian(new Date('2025-06-01')),
  );

  const [dpTimeOpen, setDpTimeOpen] = useState(false);
  const [dpTimeDate, setDpTimeDate] = useState<Date | undefined>(undefined);

  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold">تست تقویم شمسی</h1>

      {/* ════════════════════════════════════════════
          CALENDAR VARIANTS (inline)
          ════════════════════════════════════════════ */}

      {/* 1. Basic */}
      <Section title="۱. تقویم ساده">
        <Calendar
          mode="single"
          selected={basicDate}
          onSelect={setBasicDate}
          className="rounded-lg border"
        />
        {basicDate && (
          <p className="text-sm text-muted-foreground">
            انتخاب شده: {formatDatePersian(basicDate)}
          </p>
        )}
      </Section>

      {/* 2. Month & Year Dropdown */}
      <Section title="۲. تقویم با انتخاب ماه و سال">
        <Calendar
          mode="single"
          selected={captionDate}
          onSelect={setCaptionDate}
          captionLayout="dropdown"
          className="rounded-lg border"
        />
      </Section>

      {/* 3. Range */}
      <Section title="۳. تقویم بازه‌ای (دو ماهه)">
        <Card className="mx-auto w-fit p-0">
          <CardContent className="p-0">
            <Calendar
              mode="range"
              defaultMonth={rangeDate?.from}
              selected={rangeDate}
              onSelect={setRangeDate}
              numberOfMonths={2}
              disabled={(date) =>
                date > new Date() || date < new Date('1900-01-01')
              }
            />
          </CardContent>
        </Card>
        {rangeDate?.from && rangeDate?.to && (
          <p className="text-sm text-muted-foreground">
            از {formatDatePersian(rangeDate.from)} تا{' '}
            {formatDatePersian(rangeDate.to)}
          </p>
        )}
      </Section>

      {/* 4. Week Numbers */}
      <Section title="۴. تقویم با شماره هفته">
        <Card className="mx-auto w-fit p-0">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              defaultMonth={weekNumDate}
              selected={weekNumDate}
              onSelect={setWeekNumDate}
              showWeekNumber
            />
          </CardContent>
        </Card>
      </Section>

      {/* 5. Presets */}
      <Section title="۵. تقویم با پیش‌فرض‌ها">
        <Card className="mx-auto w-fit max-w-[300px]" size="sm">
          <CardContent>
            <Calendar
              mode="single"
              selected={presetDate}
              onSelect={setPresetDate}
              month={presetMonth}
              onMonthChange={setPresetMonth}
              fixedWeeks
              className="p-0 [--cell-size:--spacing(9.5)]"
            />
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 border-t">
            {[
              { label: 'امروز', value: 0 },
              { label: 'فردا', value: 1 },
              { label: '۳ روز بعد', value: 3 },
              { label: 'یک هفته بعد', value: 7 },
              { label: '۲ هفته بعد', value: 14 },
            ].map((preset) => (
              <Button
                key={preset.value}
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => {
                  const newDate = addDays(new Date(), preset.value);
                  setPresetDate(newDate);
                  setPresetMonth(
                    new Date(newDate.getFullYear(), newDate.getMonth(), 1),
                  );
                }}
              >
                {preset.label}
              </Button>
            ))}
          </CardFooter>
        </Card>
      </Section>

      {/* 6. Date and Time */}
      <Section title="۶. تقویم با ورودی ساعت">
        <Card size="sm" className="mx-auto w-fit">
          <CardContent>
            <Calendar
              mode="single"
              selected={timeDate}
              onSelect={setTimeDate}
              className="p-0"
            />
          </CardContent>
          <CardFooter className="bg-card border-t">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="time-from">ساعت شروع</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="time-from"
                    type="time"
                    step="1"
                    defaultValue="10:30:00"
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock2Icon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="time-to">ساعت پایان</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="time-to"
                    type="time"
                    step="1"
                    defaultValue="12:30:00"
                    className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                  />
                  <InputGroupAddon>
                    <Clock2Icon className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
          </CardFooter>
        </Card>
      </Section>

      {/* 7. Booked Dates */}
      <Section title="۷. تقویم با تاریخ‌های رزرو شده">
        <Card className="mx-auto w-fit p-0">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              defaultMonth={bookedDate}
              selected={bookedDate}
              onSelect={setBookedDate}
              disabled={bookedDates}
              modifiers={{ booked: bookedDates }}
              modifiersClassNames={{
                booked: '[&>button]:line-through opacity-100',
              }}
            />
          </CardContent>
        </Card>
      </Section>

      {/* 8. Custom Cell Size with pricing */}
      <Section title="۸. تقویم با سایز سفارشی و قیمت">
        <Card className="mx-auto w-fit p-0">
          <CardContent className="p-0">
            <Calendar
              mode="range"
              defaultMonth={customRange?.from}
              selected={customRange}
              onSelect={setCustomRange}
              numberOfMonths={1}
              captionLayout="dropdown"
              className="[--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
              formatters={{
                formatMonthDropdown: (date) => {
                  return date.toLocaleString('fa-IR', { month: 'long' });
                },
              }}
              components={{
                DayButton: ({ children, modifiers, day, ...props }) => {
                  const isWeekend =
                    day.date.getDay() === 5 || day.date.getDay() === 6;
                  return (
                    <CalendarDayButton
                      day={day}
                      modifiers={modifiers}
                      {...props}
                    >
                      {children}
                      {!modifiers.outside && (
                        <span>
                          {isWeekend
                            ? '۱۲۰,۰۰۰'
                            : '۱۰۰,۰۰۰'}
                        </span>
                      )}
                    </CalendarDayButton>
                  );
                },
              }}
            />
          </CardContent>
        </Card>
      </Section>

      {/* ════════════════════════════════════════════
          DATE PICKER VARIANTS (popover-based)
          ════════════════════════════════════════════ */}

      {/* 9. Basic DatePicker */}
      <Section title="۹. انتخاب تاریخ (پاپ‌آور)">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              data-empty={!dpDemo}
              className="data-[empty=true]:text-muted-foreground w-[212px] justify-between text-left font-normal"
            >
              {dpDemo ? (
                formatDatePersian(dpDemo)
              ) : (
                <span>تاریخ را انتخاب کنید</span>
              )}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dpDemo}
              onSelect={setDpDemo}
              defaultMonth={dpDemo}
            />
          </PopoverContent>
        </Popover>
      </Section>

      {/* 10. Simple DatePicker with label */}
      <Section title="۱۰. انتخاب تاریخ با برچسب">
        <Field className="w-44">
          <FieldLabel htmlFor="dp-simple">تاریخ</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dp-simple"
                className="justify-start font-normal"
              >
                {dpSimple ? (
                  formatDatePersian(dpSimple)
                ) : (
                  <span>انتخاب تاریخ</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dpSimple}
                onSelect={setDpSimple}
                defaultMonth={dpSimple}
              />
            </PopoverContent>
          </Popover>
        </Field>
      </Section>

      {/* 11. DatePicker Range */}
      <Section title="۱۱. انتخاب بازه تاریخ">
        <Field className="w-72">
          <FieldLabel htmlFor="dp-range">بازه تاریخ</FieldLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dp-range"
                className="justify-start px-2.5 font-normal"
              >
                <CalendarIcon />
                {dpRange?.from ? (
                  dpRange.to ? (
                    <>
                      {formatDatePersian(dpRange.from)} -{' '}
                      {formatDatePersian(dpRange.to)}
                    </>
                  ) : (
                    formatDatePersian(dpRange.from)
                  )
                ) : (
                  <span>انتخاب بازه</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                defaultMonth={dpRange?.from}
                selected={dpRange}
                onSelect={setDpRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </Field>
      </Section>

      {/* 12. Date of Birth */}
      <Section title="۱۲. انتخاب تاریخ تولد">
        <Field className="w-44">
          <FieldLabel htmlFor="dp-dob">تاریخ تولد</FieldLabel>
          <Popover open={dpDobOpen} onOpenChange={setDpDobOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="dp-dob"
                className="justify-start font-normal"
              >
                {dpDob
                  ? formatDatePersian(dpDob)
                  : 'انتخاب تاریخ'}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={dpDob}
                defaultMonth={dpDob}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setDpDob(date);
                  setDpDobOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </Field>
      </Section>

      {/* 13. DatePicker with Input */}
      <Section title="۱۳. انتخاب تاریخ با ورودی">
        <Field className="w-52">
          <FieldLabel htmlFor="dp-input">تاریخ اشتراک</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="dp-input"
              value={dpInputValue}
              placeholder="تاریخ را وارد کنید"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setDpInputValue(e.target.value);
                if (isValidDate(date)) {
                  setDpInputDate(date);
                  setDpInputMonth(date);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  setDpInputOpen(true);
                }
              }}
            />
            <InputGroupAddon align="inline-end">
              <Popover open={dpInputOpen} onOpenChange={setDpInputOpen}>
                <PopoverTrigger asChild>
                  <InputGroupButton
                    variant="ghost"
                    size="icon-xs"
                    aria-label="انتخاب تاریخ"
                  >
                    <CalendarIcon />
                  </InputGroupButton>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto overflow-hidden p-0"
                  align="end"
                  alignOffset={-8}
                  sideOffset={10}
                >
                  <Calendar
                    mode="single"
                    selected={dpInputDate}
                    month={dpInputMonth}
                    onMonthChange={setDpInputMonth}
                    onSelect={(date) => {
                      setDpInputDate(date);
                      setDpInputValue(formatDatePersian(date));
                      setDpInputOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </Section>

      {/* 14. DatePicker with Time */}
      <Section title="۱۴. انتخاب تاریخ و ساعت">
        <FieldGroup className="max-w-xs flex-row">
          <Field>
            <FieldLabel htmlFor="dp-time">تاریخ</FieldLabel>
            <Popover open={dpTimeOpen} onOpenChange={setDpTimeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="dp-time"
                  className="w-36 justify-between font-normal"
                >
                  {dpTimeDate
                    ? formatDatePersian(dpTimeDate)
                    : 'انتخاب تاریخ'}
                  <ChevronDownIcon />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={dpTimeDate}
                  captionLayout="dropdown"
                  defaultMonth={dpTimeDate}
                  onSelect={(date) => {
                    setDpTimeDate(date);
                    setDpTimeOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
          </Field>
          <Field className="w-32">
            <FieldLabel htmlFor="tp-time">ساعت</FieldLabel>
            <Input
              type="time"
              id="tp-time"
              step="1"
              defaultValue="10:30:00"
              className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
          </Field>
        </FieldGroup>
      </Section>
    </div>
  );
}
