# AccountSheet Component — Step-by-Step Guide

This document walks through how `components/account/account-sheet.tsx` is built, line by line. It's written for beginners who want to understand **why** each piece exists.

---

## Table of Contents

1. [What does this component do?](#1-what-does-this-component-do)
2. [The building blocks (imports)](#2-the-building-blocks-imports)
3. [Validation with Zod schemas](#3-validation-with-zod-schemas)
4. [Component props (the inputs)](#4-component-props-the-inputs)
5. [State — what the component remembers](#5-state--what-the-component-remembers)
6. [Forms with React Hook Form](#6-forms-with-react-hook-form)
7. [Fetching data from the server](#7-fetching-data-from-the-server)
8. [Handling open/close](#8-handling-openclose)
9. [Submit handlers — saving to the server](#9-submit-handlers--saving-to-the-server)
10. [The save button logic](#10-the-save-button-logic)
11. [The JSX — what the user sees](#11-the-jsx--what-the-user-sees)
12. [Connecting inputs to React Hook Form](#12-connecting-inputs-to-react-hook-form)
13. [Showing validation errors](#13-showing-validation-errors)
14. [Full data flow (putting it all together)](#14-full-data-flow-putting-it-all-together)

---

## 1. What does this component do?

It's a **side panel (Sheet)** that slides in from the right. It lets the user:

- **Personal tab:** Edit their first name and last name
- **Account tab:** Set a username (one-time only) and birth date
- **Security tab:** Change their password

```
┌──────────────────────────┐
│  حساب کاربری             │  ← Header
│                          │
│      [ Avatar ]          │  ← User photo + name
│    Name + Phone          │
│                          │
│  [مشخصات] [حساب] [امنیت]│  ← Tabs
│                          │
│  ┌────────────────────┐  │
│  │  نام: [________]   │  │  ← Form fields
│  │  نام خانوادگی:     │  │     (change per tab)
│  │       [________]   │  │
│  └────────────────────┘  │
│                          │
│  [   ذخیره مشخصات   ]   │  ← Save button
│  [      بستن         ]   │  ← Close button
└──────────────────────────┘
```

---

## 2. The building blocks (imports)

Every component starts by importing what it needs. Think of imports like gathering your tools before cooking.

```tsx
'use client';
```

This tells Next.js: "This component runs in the browser, not on the server." We need this because we use `useState`, `useEffect`, and form interactions — all of which require a browser.

```tsx
import { useEffect, useState } from 'react';
```

- **`useState`** — lets the component "remember" values (like whether data is loading)
- **`useEffect`** — lets the component "do something" when it opens (like fetching data from the server)

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
```

These three work together:
- **`z` (Zod)** — defines validation rules ("first name is required", "password must be 6+ characters")
- **`zodResolver`** — connects Zod rules to React Hook Form
- **`useForm`** — manages all form state (values, errors, submitting) so we don't need manual `useState` per field

```tsx
import { toast } from 'sonner';
```

Shows small notification popups like "Saved successfully" or "Error occurred".

```tsx
import { profileService, type ProfileUserResponse } from '@/api/services/access/profile';
import type { ApiResponse } from '@/types/api';
```

- **`profileService`** — the API layer. Has methods like `.get()`, `.updateFullName()`, `.changePassword()`, etc.
- **`ProfileUserResponse`** — TypeScript type describing what the server returns (id, name, email, etc.)
- **`ApiResponse`** — wrapper type with `ok`, `data`, and `messages` fields

The rest are **UI components** (Sheet, Tabs, Input, Button, etc.) from the project's component library, and **icons** from lucide-react.

---

## 3. Validation with Zod schemas

Before the component function, we define the **rules** for each tab's form:

### Personal tab rules

```tsx
const personalSchema = z.object({
  firstName: z.string().min(1, 'نام الزامی است'),
  lastName: z.string().min(1, 'نام خانوادگی الزامی است'),
});
```

This says:
- `firstName` must be a string with at least 1 character. If empty, show "نام الزامی است"
- `lastName` same rule

### Account tab rules

```tsx
const accountSchema = z.object({
  username: z.string().min(1, 'نام کاربری الزامی است'),
  birthDate: z.string().min(1, 'تاریخ تولد الزامی است'),
});
```

### Security tab rules

```tsx
const securitySchema = z
  .object({
    currentPassword: z.string().min(1, 'رمز عبور فعلی الزامی است'),
    newPassword: z.string().min(6, 'رمز عبور جدید باید حداقل ۶ کاراکتر باشد'),
    confirmPassword: z.string().min(1, 'تکرار رمز عبور الزامی است'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'رمز عبور جدید و تکرار آن مطابقت ندارند',
    path: ['confirmPassword'],
  });
```

This is more complex:
- `currentPassword` — required (min 1 character)
- `newPassword` — must be at least 6 characters
- `confirmPassword` — required
- `.refine(...)` — a **custom rule** that checks if `newPassword` matches `confirmPassword`. If not, it shows the error on the `confirmPassword` field.

### Auto-generating TypeScript types

```tsx
type PersonalForm = z.infer<typeof personalSchema>;
// Result: { firstName: string; lastName: string }
```

Instead of writing the type by hand, `z.infer` creates it from the schema. One source of truth for both validation and types.

---

## 4. Component props (the inputs)

```tsx
interface AccountSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountSheet({ open, onOpenChange }: AccountSheetProps) {
```

The **parent component** controls whether the sheet is visible:
- `open` — `true` = show the sheet, `false` = hide it
- `onOpenChange` — a function to call when the sheet should open or close

This is called the **"controlled component" pattern** — the parent owns the state, the child just reads it.

**How it's used by the parent (`nav-user.tsx`):**

```tsx
const [accountOpen, setAccountOpen] = useState(false);

<AccountSheet open={accountOpen} onOpenChange={setAccountOpen} />
```

---

## 5. State — what the component remembers

```tsx
const [profile, setProfile] = useState<ProfileUserResponse | null>(null);
const [loading, setLoading] = useState(false);
const [activeTab, setActiveTab] = useState('personal');
```

| State | What it stores | Why we need it |
|-------|---------------|----------------|
| `profile` | The user's data from the server (or `null` if not loaded) | To show the avatar, name, and phone number |
| `loading` | `true` while fetching data | To show skeleton placeholders instead of empty content |
| `activeTab` | Which tab is selected (`'personal'`, `'account'`, or `'security'`) | To know which form to save when the button is clicked |

```tsx
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
```

These are **UI-only toggles** for the eye icon on password fields. They don't need to be in the form — they just switch `type="password"` to `type="text"` and back.

---

## 6. Forms with React Hook Form

```tsx
const personalForm = useForm<PersonalForm>({
  resolver: zodResolver(personalSchema),
  defaultValues: { firstName: '', lastName: '' },
});
```

**What `useForm` gives us:**

| Feature | What it does |
|---------|-------------|
| `personalForm.register('firstName')` | Connects an `<Input>` to the form (tracks its value and changes) |
| `personalForm.formState.errors` | Object with validation errors (auto-populated by Zod) |
| `personalForm.formState.isSubmitting` | `true` while the submit handler is running |
| `personalForm.handleSubmit(fn)` | Validates first, then calls `fn` only if valid |
| `personalForm.reset({...})` | Sets the form values (used after fetching data from the server) |

**`resolver: zodResolver(personalSchema)`** tells React Hook Form: "Use the Zod schema to validate. Don't call my submit function unless all rules pass."

**`defaultValues`** sets the initial empty values. These get overwritten by `personalForm.reset(...)` once we fetch data from the server.

We create **3 separate forms** (one per tab) because each tab has different fields and different validation rules.

---

## 7. Fetching data from the server

```tsx
useEffect(() => {
  if (!open) return;       // Don't fetch if the sheet is closed

  async function fetchProfile() {
    setLoading(true);      // Show skeleton UI
    const { ok, data, messages } = await profileService.get();

    if (!ok || !data) {
      toast.error(messages);    // Show error notification
    } else if (data.firstName) {
      setProfile(data);         // Store the profile for display

      // Fill the forms with server data
      personalForm.reset({ firstName: data.firstName, lastName: data.lastName });
      accountForm.reset({
        username: data.username ?? '',
        birthDate: data.birthDay ? (data.birthDay.split('T')[0] ?? '') : '',
      });
    }
    setLoading(false);     // Hide skeleton UI
  }

  fetchProfile();
}, [open]);                // Re-run when `open` changes
```

**Step by step:**

1. Sheet opens → `open` becomes `true` → `useEffect` runs
2. Show loading skeletons (`setLoading(true)`)
3. Call the API (`profileService.get()`)
4. If error → show a toast notification
5. If success → store the profile and fill the form fields with the user's existing data
6. Hide loading skeletons (`setLoading(false)`)

**Why `personalForm.reset(...)` instead of `setValue`?**

`reset` sets the values AND marks the form as "clean" (not dirty). This means if the user opens the sheet and doesn't change anything, the form knows nothing was modified.

**Why `data.birthDay.split('T')[0]`?**

The server returns dates like `"1380/01/15T00:00:00"`. We only want `"1380/01/15"`, so we split at `T` and take the first part.

---

## 8. Handling open/close

```tsx
function handleOpenChange(value: boolean) {
  if (!value) {                           // If closing the sheet:
    securityForm.reset();                 // Clear password fields
    setShowCurrentPassword(false);        // Hide all passwords
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setActiveTab('personal');             // Reset to first tab
  }
  onOpenChange(value);                    // Tell the parent to update
}
```

When the user closes the sheet, we clean up:
- Password fields are cleared (security — don't keep passwords in memory)
- Password visibility is turned off
- Tab resets to "personal" so next time it opens on the first tab

We don't reset `personalForm` or `accountForm` because those values come from the server and will be re-fetched next time.

---

## 9. Submit handlers — saving to the server

Each tab has its own submit handler. These only run **after Zod validation passes**.

### Personal tab

```tsx
async function onSubmitPersonal(data: PersonalForm) {
  const { ok, messages } = await profileService.updateFullName({
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
  });
  if (!ok) {
    toast.error(messages);
  } else {
    toast.success('نام با موفقیت ذخیره شد');
    setProfile((prev) =>
      prev ? { ...prev, firstName: data.firstName.trim(), lastName: data.lastName.trim() } : prev,
    );
  }
}
```

1. Call the API with trimmed values
2. If error → show error toast
3. If success → show success toast AND update the local `profile` state

**Why `setProfile((prev) => ...)`?**

This is called an **optimistic local update**. Instead of re-fetching the entire profile from the server, we just update the local copy. This makes the UI update instantly — the avatar section immediately shows the new name.

### Security tab

```tsx
async function onSubmitSecurity(data: SecurityForm) {
  const { ok, messages } = await profileService.changePassword({
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  });
  if (!ok) {
    toast.error(messages);
  } else {
    toast.success('رمز عبور با موفقیت تغییر کرد');
    securityForm.reset();     // Clear all password fields after success
  }
}
```

Note: we send `currentPassword` and `newPassword` to the API, but NOT `confirmPassword`. The confirm field is only for client-side validation (Zod already checked they match).

---

## 10. The save button logic

The sheet has ONE save button at the bottom. It needs to know which tab is active to call the right handler:

```tsx
async function handleSave() {
  switch (activeTab) {
    case 'personal':
      await personalForm.handleSubmit(onSubmitPersonal)();
      break;
    case 'account':
      await accountForm.handleSubmit(onSubmitAccount)();
      break;
    case 'security':
      await securityForm.handleSubmit(onSubmitSecurity)();
      break;
  }
}
```

**What `personalForm.handleSubmit(onSubmitPersonal)()` does:**

1. Validates all fields against the Zod schema
2. If **invalid** → sets `formState.errors` on the failing fields (the submit function is NOT called)
3. If **valid** → calls `onSubmitPersonal(data)` with the clean, typed form data

The double `()` is because `handleSubmit` returns a function, and we immediately call it.

### Dynamic button labels

```tsx
const saveLabels: Record<string, [string, string]> = {
  personal: ['ذخیره مشخصات', 'در حال ذخیره...'],
  account: ['ذخیره اطلاعات', 'در حال ذخیره...'],
  security: ['تغییر رمز عبور', 'در حال تغییر...'],
};
```

Each tab has two labels: `[normal, submitting]`. The button shows the first or second based on `isSaving`.

### The `isSaving` flag

```tsx
const isSaving =
  personalForm.formState.isSubmitting ||
  accountForm.formState.isSubmitting ||
  securityForm.formState.isSubmitting;
```

React Hook Form tracks `isSubmitting` automatically — it's `true` from the moment the submit handler starts until it finishes (including the `await` for the API call). No manual `setSaving(true)` / `setSaving(false)` needed.

---

## 11. The JSX — what the user sees

The component has 3 states:

```tsx
{loading ? (
  // State 1: Loading — show skeleton placeholders
  <Skeleton ... />
) : profile ? (
  // State 2: Data loaded — show the actual content
  <>
    Avatar + Tabs + Forms + Footer
  </>
) : null}
// State 3: No profile (fetch failed) — show nothing
```

### The RTL scrollbar trick

```tsx
<div className="flex-1 min-h-0 overflow-y-auto" dir="ltr">
  <div dir="rtl" className="flex flex-col gap-4 px-4 py-4">
```

This is a CSS trick for RTL (right-to-left) languages like Persian:
- The outer div is `dir="ltr"` — this puts the scrollbar on the **right side** (where users expect it)
- The inner div is `dir="rtl"` — this makes the actual text and layout right-to-left

Without this, the scrollbar would appear on the left in RTL mode, which looks wrong.

---

## 12. Connecting inputs to React Hook Form

```tsx
<Input
  id="firstName"
  {...personalForm.register('firstName')}
  placeholder="نام"
  aria-invalid={!!personalForm.formState.errors.firstName}
/>
```

**`{...personalForm.register('firstName')}`** is the key part. It spreads these props onto the input:

```tsx
{
  name: 'firstName',
  onChange: [function],    // Updates form value when user types
  onBlur: [function],     // Triggers validation when user leaves the field
  ref: [function],        // Gives React Hook Form direct access to the DOM element
}
```

This replaces the old pattern of:

```tsx
// OLD — manual useState per field
const [firstName, setFirstName] = useState('');
<Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />

// NEW — React Hook Form handles everything
<Input {...personalForm.register('firstName')} />
```

**`aria-invalid`** is an accessibility attribute. Screen readers will announce "invalid entry" when this is `true`. We set it based on whether there's an error for this field.

---

## 13. Showing validation errors

```tsx
{personalForm.formState.errors.firstName && (
  <p className="text-xs text-destructive">
    {personalForm.formState.errors.firstName.message}
  </p>
)}
```

This pattern:

1. Check if there's an error for `firstName` → `personalForm.formState.errors.firstName`
2. If yes, render a red `<p>` tag with the error message
3. The message comes from the Zod schema: `z.string().min(1, 'نام الزامی است')` → `'نام الزامی است'`

**When do errors appear?**
- When the user clicks Save and validation fails
- Errors **clear automatically** when the user fixes the field (React Hook Form handles this — no manual `clearError` needed)

---

## 14. Full data flow (putting it all together)

### When the sheet opens

```
User clicks "حساب کاربری" in sidebar
  → Parent sets accountOpen = true
    → AccountSheet receives open = true
      → useEffect runs
        → setLoading(true) → skeleton UI shows
        → profileService.get() → API call
        → Response arrives
        → setProfile(data) → avatar and name display
        → personalForm.reset({...}) → form fields fill with server data
        → setLoading(false) → skeleton hides, content shows
```

### When the user edits and saves

```
User types in "firstName" input
  → register('firstName') onChange fires
    → React Hook Form updates its internal value
    → If there was an error, it clears automatically

User clicks "ذخیره مشخصات"
  → handleSave() runs
    → activeTab is 'personal'
      → personalForm.handleSubmit(onSubmitPersonal)()
        → Zod validates: is firstName non-empty? is lastName non-empty?
          → If INVALID:
            → formState.errors updates → red error messages appear
            → onSubmitPersonal is NOT called
          → If VALID:
            → formState.isSubmitting = true → button shows "در حال ذخیره..."
            → onSubmitPersonal(data) runs
              → profileService.updateFullName() → API call
              → Success → toast.success() + update local profile
              → Error → toast.error()
            → formState.isSubmitting = false → button returns to normal
```

### When the sheet closes

```
User clicks "بستن"
  → handleOpenChange(false)
    → securityForm.reset() → password fields clear
    → show*Password = false → passwords hidden
    → activeTab = 'personal' → reset to first tab
    → onOpenChange(false) → parent sets accountOpen = false → sheet slides out
```

---

## Key Concepts Summary

| Concept | What it means | Where it's used |
|---------|--------------|-----------------|
| `'use client'` | Component runs in the browser | Line 1 |
| Props (`open`, `onOpenChange`) | Parent controls the child | Lines 65-68 |
| `useState` | Component remembers a value | Lines 71-78 |
| `useEffect` | Do something when a value changes | Lines 98-119 |
| `useForm` + `zodResolver` | Manage form fields and validate with Zod | Lines 82-95 |
| `register('field')` | Connect an input to React Hook Form | Lines 287, 304, etc. |
| `handleSubmit(fn)` | Validate first, then call `fn` if valid | Lines 189, 192, 195 |
| `formState.errors` | Validation errors from Zod | Lines 289-295, etc. |
| `formState.isSubmitting` | True while the submit handler runs | Lines 206-209 |
| `reset({...})` | Set form values (e.g., after fetching) | Lines 108-112 |
| `.refine(...)` | Custom Zod rule (password match check) | Lines 54-57 |
| `z.infer<typeof schema>` | Generate TypeScript type from Zod schema | Lines 59-61 |
| Optimistic update | Update local state without re-fetching | Lines 143-145 |
| `toast.success()` / `toast.error()` | Show notification popups | Throughout |
