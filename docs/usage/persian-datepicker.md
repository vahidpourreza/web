# Persian Date Picker

Jalali/Shamsi date picker based on [persian-date-kit](https://github.com/aliseyedabady/darvix-persian-date-kit).

## Import

Always import from the project wrapper (not directly from `persian-date-kit`):

```tsx
import { PersianDatePicker, PersianDateRangePicker } from '@/components/common/persian-datepicker';
import type { PersianDateRange } from '@/components/common/persian-datepicker';
```

---

## 1. Single Date (تکی)

```tsx
const [date, setDate] = useState<Date | null>(null);

<PersianDatePicker
  value={date}
  onChange={(d) => setDate(d as Date | null)}
  placeholder="تاریخ را انتخاب کنید"
/>
```

## 2. Date + Time (تاریخ و ساعت)

```tsx
const [date, setDate] = useState<Date | null>(null);

<PersianDatePicker
  value={date}
  onChange={(d) => setDate(d as Date | null)}
  placeholder="تاریخ و ساعت را انتخاب کنید"
  timePicker={{ enabled: true, format: 'HH:mm' }}
/>
```

Options for `timePicker`:

| Prop          | Type                     | Default    |
| ------------- | ------------------------ | ---------- |
| `enabled`     | `boolean`                | `false`    |
| `format`      | `'HH:mm'` \| `'HH:mm:ss'` | `'HH:mm'` |
| `showSeconds` | `boolean`                | `false`    |
| `hourStep`    | `number`                 | `1`        |
| `minuteStep`  | `number`                 | `1`        |
| `secondStep`  | `number`                 | `1`        |

## 3. Multiple Dates (چندتایی)

```tsx
const [dates, setDates] = useState<Date[] | null>(null);

<PersianDatePicker
  value={dates}
  onChange={(d) => setDates(d as Date[])}
  placeholder="تاریخ‌ها را انتخاب کنید"
  multiple
  maxSelections={5}
/>
```

## 4. Date Range - Two Inputs (بازه - دو اینپوت)

```tsx
const [range, setRange] = useState<PersianDateRange>({ start: null, end: null });

<PersianDateRangePicker
  value={range}
  onChange={setRange}
  placeholderStart="از تاریخ"
  placeholderEnd="تا تاریخ"
/>
```

## 5. Date Range - Single Input (بازه - تک اینپوت)

```tsx
const [range, setRange] = useState<PersianDateRange>({ start: null, end: null });

<PersianDateRangePicker
  value={range}
  onChange={setRange}
  inputVariant="single"
  placeholder="بازه تاریخ را انتخاب کنید"
/>
```

## 6. Inline Calendar (اینلاین)

No popover, always visible:

```tsx
const [date, setDate] = useState<Date | null>(new Date());

<PersianDatePicker
  value={date}
  onChange={(d) => setDate(d as Date | null)}
  mode="inline"
/>
```

---

## Common Props

| Prop            | Type                          | Default     | Description               |
| --------------- | ----------------------------- | ----------- | ------------------------- |
| `value`         | `Date \| null \| Date[]`      | -           | Selected date(s)          |
| `onChange`       | `(date) => void`              | -           | Change handler            |
| `placeholder`   | `string`                      | -           | Input placeholder text    |
| `disabled`      | `boolean`                     | `false`     | Disable the picker        |
| `minDate`       | `Date`                        | -           | Minimum selectable date   |
| `maxDate`       | `Date`                        | -           | Maximum selectable date   |
| `mode`          | `'popover' \| 'inline'`       | `'popover'` | Rendering mode            |
| `multiple`      | `boolean`                     | `false`     | Allow multiple selections |
| `maxSelections` | `number`                      | -           | Max dates in multiple mode|
| `timePicker`    | `TimePickerConfig \| boolean` | -           | Enable time picker        |
| `className`     | `string`                      | -           | Additional CSS class      |

## React Hook Form

```tsx
import { usePersianDatePickerController } from 'persian-date-kit/react-hook-form';

const { pickerProps } = usePersianDatePickerController({
  name: 'birthDate',
  control,
  rules: { required: 'تاریخ الزامی است' },
});

<PersianDatePicker {...pickerProps} placeholder="تاریخ تولد" />
```

## Styling

Theme and styling is centralized:
- **CSS overrides**: `styles/persian-datepicker.css`
- **Component wrapper**: `components/common/persian-datepicker.tsx`

Dark/light mode is handled automatically via CSS variables.

## Test Page

All examples are available at `/test` route.
