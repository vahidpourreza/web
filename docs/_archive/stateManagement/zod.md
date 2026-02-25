# Zod — Beginner Guide

Zod is a **schema validation library** for TypeScript. It lets you define rules for your data once and get both **validation** and **TypeScript types** from the same definition.

---

## Why use it?

Without Zod, you write validation and types **separately**:

```tsx
// Step 1: Define the type
type UserForm = {
  name: string;
  email: string;
  age: number;
};

// Step 2: Write validation manually (duplicates the rules!)
function validate(data: UserForm) {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = 'Name is required';
  if (!data.email.includes('@')) errors.email = 'Invalid email';
  if (data.age < 18) errors.age = 'Must be 18+';
  return errors;
}
```

With Zod, **one definition** gives you both:

```tsx
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
});

// TypeScript type is auto-generated from the schema
type UserForm = z.infer<typeof userSchema>;
// Result: { name: string; email: string; age: number }
```

**One source of truth. No duplication.**

---

## Installation

```bash
pnpm add zod
```

---

## Core Concepts

### 1. Basic Types

Zod has a builder for every JavaScript type:

```tsx
import { z } from 'zod';

z.string()     // must be a string
z.number()     // must be a number
z.boolean()    // must be true or false
z.date()       // must be a Date object
z.undefined()  // must be undefined
z.null()       // must be null
z.any()        // accepts anything (escape hatch)
```

### 2. String Validations

```tsx
z.string()                          // any string
z.string().min(1, 'Required')      // at least 1 character (= not empty)
z.string().min(6, 'Too short')     // at least 6 characters
z.string().max(100, 'Too long')    // at most 100 characters
z.string().email('Invalid email')  // must be a valid email
z.string().url('Invalid URL')      // must be a valid URL
z.string().startsWith('https://')  // must start with https://
z.string().regex(/^[a-z]+$/, 'Only lowercase letters')  // custom regex
```

### 3. Number Validations

```tsx
z.number()                         // any number
z.number().min(0, 'Must be positive')
z.number().max(100, 'Too high')
z.number().int('Must be a whole number')
z.number().positive('Must be positive')
z.number().nonnegative('Cannot be negative')
```

### 4. Objects — Grouping fields together

```tsx
const userSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  age: z.number().min(18, 'Must be 18+'),
});

// This creates a validator for: { name: string, email: string, age: number }
```

### 5. Optional and Nullable

```tsx
z.string().optional()   // string | undefined — field can be missing
z.string().nullable()   // string | null      — field can be null
z.string().nullish()    // string | null | undefined — both
```

Example:

```tsx
const profileSchema = z.object({
  name: z.string().min(1),           // required
  bio: z.string().optional(),         // optional — can be undefined
  avatar: z.string().url().nullable(), // can be null (no avatar)
});

type Profile = z.infer<typeof profileSchema>;
// { name: string; bio?: string; avatar: string | null }
```

### 6. Default Values

```tsx
z.string().default('Unknown')   // if undefined, use 'Unknown'
z.number().default(0)           // if undefined, use 0
z.boolean().default(false)      // if undefined, use false
```

---

## Validating Data

### `parse` — throws an error if invalid

```tsx
const schema = z.string().email();

schema.parse('user@example.com');   // Returns: 'user@example.com'
schema.parse('not-an-email');       // THROWS: ZodError
```

### `safeParse` — returns a result object (recommended)

```tsx
const result = schema.safeParse('not-an-email');

if (result.success) {
  console.log(result.data);   // the valid data
} else {
  console.log(result.error.issues);
  // [{ path: [], message: 'Invalid email', code: 'invalid_string' }]
}
```

**Always prefer `safeParse`** — it doesn't throw, so you can handle errors gracefully.

### Validating objects

```tsx
const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(18, 'Must be 18+'),
});

const result = userSchema.safeParse({ name: '', age: 15 });

if (!result.success) {
  result.error.issues.forEach((issue) => {
    console.log(`${issue.path.join('.')}: ${issue.message}`);
  });
  // Output:
  // name: Name is required
  // age: Must be 18+
}
```

---

## Advanced Features

### 1. `.refine()` — Custom validation rules

When built-in validators aren't enough, write your own:

```tsx
const passwordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(1),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],  // which field shows the error
  });
```

**How it works:**
1. First, the `.object()` rules run (min length checks)
2. Then, `.refine()` runs the custom function
3. If the function returns `false`, the error is added to the specified `path`

### 2. `.transform()` — Change the data during validation

```tsx
const schema = z.string().transform((val) => val.trim().toLowerCase());

schema.parse('  Hello World  ');  // Returns: 'hello world'
```

Useful for cleaning up user input.

### 3. Enums — Restrict to specific values

```tsx
const roleSchema = z.enum(['admin', 'user', 'guest']);

roleSchema.parse('admin');    // OK
roleSchema.parse('hacker');   // Error: invalid value
```

### 4. Arrays

```tsx
z.array(z.string())                    // string[]
z.array(z.number()).min(1, 'Need at least one')  // non-empty number[]
z.array(z.string()).max(5, 'Too many')  // at most 5 strings

// Array of objects
const todosSchema = z.array(
  z.object({
    title: z.string(),
    done: z.boolean(),
  })
);
```

### 5. Union — One of several types

```tsx
const idSchema = z.union([z.string(), z.number()]);

idSchema.parse('abc');  // OK
idSchema.parse(123);    // OK
idSchema.parse(true);   // Error
```

### 6. Extending and Picking from schemas

```tsx
const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
});

// Create a new schema with only some fields
const loginSchema = userSchema.pick({ email: true, password: true });
// { email: string, password: string }

// Create a new schema without some fields
const publicSchema = userSchema.omit({ password: true });
// { name: string, email: string }

// Add fields to an existing schema
const adminSchema = userSchema.extend({
  role: z.literal('admin'),
});
// { name: string, email: string, password: string, role: 'admin' }
```

---

## Using with React Hook Form

This is the most common use case. See `docs/learn/react-hook-form.md` for the full RHF guide.

```bash
pnpm add react-hook-form @hookform/resolvers zod
```

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define schema (validation rules + types in one place)
const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Must be at least 6 characters'),
});

// 2. Auto-generate TypeScript type
type FormData = z.infer<typeof schema>;

// 3. Use in the component
function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),   // ← connects Zod to RHF
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <input {...register('password')} type="password" />
      {errors.password && <p>{errors.password.message}</p>}

      <button type="submit">Login</button>
    </form>
  );
}
```

**Why this combo is powerful:**
- Zod schema = single source of truth for validation rules AND types
- React Hook Form handles form state (no `useState` per field)
- `zodResolver` bridges them — RHF delegates validation to Zod
- Error messages from the Zod schema appear in `formState.errors` automatically

---

## Generating Types with `z.infer`

This is one of Zod's best features:

```tsx
const productSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  tags: z.array(z.string()).optional(),
  status: z.enum(['active', 'archived']),
});

type Product = z.infer<typeof productSchema>;
// Equivalent to writing:
// type Product = {
//   name: string;
//   price: number;
//   tags?: string[];
//   status: 'active' | 'archived';
// }
```

**You never need to write the type by hand.** Change the schema → the type updates automatically.

---

## Real-World Example — Registration Form

```tsx
const registrationSchema = z
  .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    age: z.number().min(18, 'Must be 18 or older').max(120, 'Invalid age'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegistrationForm = z.infer<typeof registrationSchema>;
```

---

## Cheat Sheet

| Task | Code |
|------|------|
| Required string | `z.string().min(1, 'Required')` |
| Email | `z.string().email('Invalid')` |
| Min length | `z.string().min(6, 'Too short')` |
| Number range | `z.number().min(0).max(100)` |
| Optional field | `z.string().optional()` |
| Nullable field | `z.string().nullable()` |
| Object | `z.object({ name: z.string() })` |
| Array | `z.array(z.string())` |
| Enum | `z.enum(['a', 'b', 'c'])` |
| Custom rule | `.refine((val) => condition, { message: '...' })` |
| Transform | `.transform((val) => val.trim())` |
| Get type | `type MyType = z.infer<typeof mySchema>` |
| Validate (safe) | `schema.safeParse(data)` |
| Validate (throws) | `schema.parse(data)` |
| Pick fields | `schema.pick({ name: true })` |
| Omit fields | `schema.omit({ password: true })` |
| Extend | `schema.extend({ newField: z.string() })` |
