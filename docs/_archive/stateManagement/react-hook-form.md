# React Hook Form — Beginner Guide

React Hook Form is a library that manages **form state** (input values, errors, submission) with minimal code and re-renders.

---

## Why use it?

Without React Hook Form, you write this for **every** form:

```tsx
// Manual approach — lots of boilerplate
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

function validate() {
  const newErrors: Record<string, string> = {};
  if (!name.trim()) newErrors.name = 'Name is required';
  if (!email.includes('@')) newErrors.email = 'Invalid email';
  return newErrors;
}

async function handleSubmit() {
  const newErrors = validate();
  if (Object.keys(newErrors).length) {
    setErrors(newErrors);
    return;
  }
  setIsSubmitting(true);
  await api.save({ name, email });
  setIsSubmitting(false);
}

<input value={name} onChange={(e) => { setName(e.target.value); setErrors(prev => { delete prev.name; return {...prev}; }); }} />
{errors.name && <p>{errors.name}</p>}
```

With React Hook Form:

```tsx
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

<input {...register('name', { required: 'Name is required' })} />
{errors.name && <p>{errors.name.message}</p>}

<button onClick={handleSubmit(async (data) => await api.save(data))} disabled={isSubmitting} />
```

**Same result, ~70% less code.**

---

## Installation

```bash
pnpm add react-hook-form
```

---

## Core Concepts

### 1. `useForm` — The main hook

```tsx
import { useForm } from 'react-hook-form';

// Define the shape of your form
type LoginForm = {
  email: string;
  password: string;
};

function LoginPage() {
  const form = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
}
```

`useForm` returns an object with everything you need. Let's break down each piece:

### 2. `register` — Connect an input to the form

```tsx
<input {...form.register('email')} />
```

`register('email')` returns these props:

```tsx
{
  name: 'email',
  onChange: [function],   // Updates the form's internal value
  onBlur: [function],     // Can trigger validation when the user leaves
  ref: [function],        // Gives RHF access to the DOM element
}
```

The `{...spread}` syntax puts all of these onto the `<input>`. Now React Hook Form tracks this input automatically — no `useState` needed.

**With validation rules:**

```tsx
<input {...form.register('email', {
  required: 'Email is required',
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },
})} />
```

### 3. `handleSubmit` — Validate then call your function

```tsx
async function onSubmit(data: LoginForm) {
  // This only runs if ALL validation rules pass
  console.log(data); // { email: "user@example.com", password: "123456" }
  await api.login(data);
}

<button onClick={form.handleSubmit(onSubmit)}>Login</button>
```

**What happens when you click:**

```
Click → handleSubmit runs
  → Validates all registered fields
    → If INVALID → sets formState.errors, does NOT call onSubmit
    → If VALID   → calls onSubmit(data) with clean, typed data
```

### 4. `formState` — Track form status

```tsx
const { formState } = form;

formState.errors          // { email: { message: "Email is required" }, ... }
formState.isSubmitting    // true while onSubmit is running (async)
formState.isDirty         // true if any field was changed from defaultValues
formState.isValid         // true if all validations pass
formState.touchedFields   // which fields the user has interacted with
```

### 5. `reset` — Set or clear form values

```tsx
// Clear everything to defaultValues
form.reset();

// Set specific values (e.g., after fetching from API)
form.reset({
  email: 'user@example.com',
  password: '',
});
```

### 6. `watch` — Read a field value in real-time

```tsx
const password = form.watch('password');

// Show password strength indicator
<p>Length: {password.length}</p>
```

Note: `watch` causes re-renders. Only use it when you need to display a value outside the input.

### 7. `setValue` and `getValues` — Manual control

```tsx
// Set a single field programmatically
form.setValue('email', 'new@example.com');

// Read current values without re-rendering
const values = form.getValues();
console.log(values.email);
```

---

## Full Example — Login Form

```tsx
'use client';

import { useForm } from 'react-hook-form';

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(data: LoginForm) {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      alert('Login failed');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Email field */}
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Enter a valid email',
          },
        })}
        aria-invalid={!!errors.email}
      />
      {errors.email && <p className="error">{errors.email.message}</p>}

      {/* Password field */}
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        {...register('password', {
          required: 'Password is required',
          minLength: { value: 6, message: 'Must be at least 6 characters' },
        })}
        aria-invalid={!!errors.password}
      />
      {errors.password && <p className="error">{errors.password.message}</p>}

      {/* Submit */}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

---

## Using with Zod (recommended)

Instead of inline rules, use a Zod schema for validation. See `docs/learn/zod.md` for the full Zod guide.

```bash
pnpm add zod @hookform/resolvers
```

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { email: '', password: '' },
});

// Same JSX — errors work the same way
<input {...register('email')} />
{errors.email && <p>{errors.email.message}</p>}
```

**Why Zod is better than inline rules:**
- One schema = validation + TypeScript types (single source of truth)
- Schemas are reusable (same schema for frontend form + API validation)
- Complex rules (cross-field validation, conditional rules) are easier to write

---

## Common Patterns

### Pre-fill form from API data

```tsx
useEffect(() => {
  async function load() {
    const user = await api.getUser();
    form.reset({
      email: user.email,
      name: user.name,
    });
  }
  load();
}, []);
```

### Multiple forms in one component

```tsx
const personalForm = useForm({ ... });
const securityForm = useForm({ ... });

// Each form is independent — separate values, errors, submission
<input {...personalForm.register('firstName')} />
<input {...securityForm.register('currentPassword')} />
```

### Show error only after the user touched the field

```tsx
// By default, errors show after submit. To show on blur:
const form = useForm({
  mode: 'onBlur',  // validate when user leaves the field
});

// Other modes:
// 'onSubmit'  — validate only on submit (default)
// 'onChange'  — validate on every keystroke (can be slow)
// 'onBlur'   — validate when user leaves the field
// 'all'      — validate on both change and blur
```

### Conditional fields

```tsx
const role = form.watch('role');

<select {...form.register('role')}>
  <option value="user">User</option>
  <option value="admin">Admin</option>
</select>

{role === 'admin' && (
  <input {...form.register('adminCode', { required: 'Admin code is required' })} />
)}
```

---

## Cheat Sheet

| Task | Code |
|------|------|
| Create a form | `const form = useForm<MyType>({ defaultValues: {...} })` |
| Connect an input | `<input {...form.register('fieldName')} />` |
| Add validation | `form.register('field', { required: 'Message' })` |
| Use Zod validation | `useForm({ resolver: zodResolver(schema) })` |
| Show errors | `{errors.field && <p>{errors.field.message}</p>}` |
| Handle submit | `<button onClick={form.handleSubmit(onSubmit)}>` |
| Check if submitting | `form.formState.isSubmitting` |
| Set values from API | `form.reset({ field: value })` |
| Read a value live | `form.watch('fieldName')` |
| Set one value | `form.setValue('field', 'value')` |
| Clear the form | `form.reset()` |
