# Week 5: Forms & Data Handling

**Duration**: 7 days
**Focus**: Form handling, validation, React Hook Form, Zod
**Prerequisites**: Week 1-4 completed

---

## Goals

By the end of this week, you will:
- ✅ Create forms with controlled components
- ✅ Handle form submission
- ✅ Validate form inputs
- ✅ Use React Hook Form for complex forms
- ✅ Implement type-safe validation with Zod

---

## Day 1-2: Basic Forms

### Tasks

- [ ] Create forms with controlled inputs
- [ ] Handle form submission
- [ ] Add basic validation
- [ ] Understand controlled vs uncontrolled components

### Controlled Components

**Concept:** React manages the form state

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()  // Prevent page reload
    console.log({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">ایمیل</label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="password">رمز عبور</label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="********"
        />
      </div>

      <Button type="submit">ورود</Button>
    </form>
  )
}
```

### Form Components from Project

**Field + Input:**
```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

<Field>
  <FieldLabel htmlFor="name">نام</FieldLabel>
  <Input
    id="name"
    placeholder="نام خود را وارد کنید"
    required
  />
</Field>
```

**Select Dropdown:**
```tsx
import { Field, FieldLabel } from "@/components/ui/field"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

<Field>
  <FieldLabel htmlFor="role">نقش</FieldLabel>
  <Select defaultValue="">
    <SelectTrigger id="role">
      <SelectValue placeholder="یک نقش انتخاب کنید" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="developer">توسعه‌دهنده</SelectItem>
      <SelectItem value="designer">طراح</SelectItem>
      <SelectItem value="manager">مدیر</SelectItem>
    </SelectContent>
  </Select>
</Field>
```

**Textarea:**
```tsx
import { Textarea } from "@/components/ui/textarea"

<Field>
  <FieldLabel htmlFor="comments">نظرات</FieldLabel>
  <Textarea
    id="comments"
    placeholder="نظرات اضافی خود را وارد کنید"
  />
</Field>
```

### Practice: Registration Form

```tsx
"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      alert("رمزهای عبور مطابقت ندارند")
      return
    }

    console.log("ثبت‌نام:", formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <Field>
        <FieldLabel htmlFor="name">نام</FieldLabel>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="email">ایمیل</FieldLabel>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">تکرار رمز عبور</FieldLabel>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </Field>

      <Button type="submit">ثبت‌نام</Button>
    </form>
  )
}
```

---

## Day 3-4: React Hook Form

### Tasks

- [ ] Install React Hook Form
- [ ] Refactor form to use React Hook Form
- [ ] Understand register and handleSubmit
- [ ] Display validation errors

### Installation

```bash
pnpm add react-hook-form
```

### Basic Usage

```tsx
"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface FormData {
  email: string
  password: string
}

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>ایمیل</label>
        <Input
          {...register("email", {
            required: "ایمیل الزامی است",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "ایمیل نامعتبر است"
            }
          })}
          type="email"
        />
        {errors.email && (
          <span className="text-destructive text-sm">
            {errors.email.message}
          </span>
        )}
      </div>

      <div>
        <label>رمز عبور</label>
        <Input
          {...register("password", {
            required: "رمز عبور الزامی است",
            minLength: {
              value: 8,
              message: "حداقل ۸ کاراکتر"
            }
          })}
          type="password"
        />
        {errors.password && (
          <span className="text-destructive text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button type="submit">ورود</Button>
    </form>
  )
}
```

### Register Options

```tsx
{...register("fieldName", {
  required: "این فیلد الزامی است",
  minLength: { value: 3, message: "حداقل ۳ کاراکتر" },
  maxLength: { value: 20, message: "حداکثر ۲۰ کاراکتر" },
  pattern: { value: /regex/, message: "فرمت نامعتبر" },
  validate: (value) => value !== "admin" || "نام کاربری غیرمجاز"
})}
```

---

## Day 5-7: Zod Validation

### Tasks

- [ ] Install Zod and resolver
- [ ] Create validation schemas
- [ ] Use zodResolver with React Hook Form
- [ ] Build complete registration form

### Installation

```bash
pnpm add zod @hookform/resolvers
```

### Zod Schema

```tsx
import { z } from "zod"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "ایمیل الزامی است")
    .email("ایمیل نامعتبر است"),
  password: z
    .string()
    .min(8, "رمز عبور باید حداقل ۸ کاراکتر باشد")
    .regex(/[A-Z]/, "باید شامل حروف بزرگ باشد")
    .regex(/[0-9]/, "باید شامل عدد باشد"),
})

type LoginSchema = z.infer<typeof loginSchema>
```

### Integration with React Hook Form

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

const registrationSchema = z.object({
  name: z
    .string()
    .min(2, "نام باید حداقل ۲ کاراکتر باشد"),
  email: z
    .string()
    .email("ایمیل نامعتبر است"),
  password: z
    .string()
    .min(8, "حداقل ۸ کاراکتر")
    .regex(/[A-Z]/, "باید شامل حروف بزرگ باشد")
    .regex(/[0-9]/, "باید شامل عدد باشد"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "رمزهای عبور مطابقت ندارند",
  path: ["confirmPassword"],
})

type RegistrationSchema = z.infer<typeof registrationSchema>

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationSchema>({
    resolver: zodResolver(registrationSchema),
  })

  const onSubmit = async (data: RegistrationSchema) => {
    console.log(data)
    // API call here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Field>
        <FieldLabel htmlFor="name">نام</FieldLabel>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <span className="text-destructive text-sm">{errors.name.message}</span>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">ایمیل</FieldLabel>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <span className="text-destructive text-sm">{errors.email.message}</span>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="password">رمز عبور</FieldLabel>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <span className="text-destructive text-sm">{errors.password.message}</span>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="confirmPassword">تکرار رمز عبور</FieldLabel>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && (
          <span className="text-destructive text-sm">{errors.confirmPassword.message}</span>
        )}
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ثبت‌نام..." : "ثبت‌نام"}
      </Button>
    </form>
  )
}
```

### Advanced Zod Patterns

**Nested Objects:**
```tsx
const userSchema = z.object({
  profile: z.object({
    name: z.string(),
    age: z.number(),
  }),
  address: z.object({
    street: z.string(),
    city: z.string(),
  }),
})
```

**Arrays:**
```tsx
const schema = z.object({
  tags: z.array(z.string()).min(1, "حداقل یک تگ"),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number().min(1).max(5),
  })),
})
```

**Optional Fields:**
```tsx
const schema = z.object({
  name: z.string(),
  middleName: z.string().optional(),
  age: z.number().nullable(),
})
```

**Custom Validation:**
```tsx
const schema = z.object({
  username: z.string().refine(
    async (val) => {
      // Check if username exists
      const exists = await checkUsername(val)
      return !exists
    },
    { message: "نام کاربری قبلاً استفاده شده است" }
  ),
})
```

---

## Complete Example: Profile Form

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"

const profileSchema = z.object({
  name: z.string().min(2, "حداقل ۲ کاراکتر"),
  email: z.string().email("ایمیل نامعتبر"),
  role: z.enum(["developer", "designer", "manager"], {
    required_error: "لطفاً نقش را انتخاب کنید",
  }),
  bio: z.string().max(500, "حداکثر ۵۰۰ کاراکتر").optional(),
  website: z.string().url("آدرس نامعتبر").optional().or(z.literal("")),
})

type ProfileSchema = z.infer<typeof profileSchema>

export function ProfileForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      website: "",
    },
  })

  const onSubmit = async (data: ProfileSchema) => {
    console.log(data)
    // API call
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <Field>
        <FieldLabel htmlFor="name">نام</FieldLabel>
        <Input id="name" {...register("name")} />
        {errors.name && <span className="text-destructive text-sm">{errors.name.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="email">ایمیل</FieldLabel>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <span className="text-destructive text-sm">{errors.email.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="role">نقش</FieldLabel>
        <Select onValueChange={(value) => setValue("role", value as any)}>
          <SelectTrigger id="role">
            <SelectValue placeholder="نقش خود را انتخاب کنید" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="developer">توسعه‌دهنده</SelectItem>
            <SelectItem value="designer">طراح</SelectItem>
            <SelectItem value="manager">مدیر</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && <span className="text-destructive text-sm">{errors.role.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="bio">بیوگرافی</FieldLabel>
        <Textarea id="bio" {...register("bio")} placeholder="درباره خودتان بنویسید" />
        {errors.bio && <span className="text-destructive text-sm">{errors.bio.message}</span>}
      </Field>

      <Field>
        <FieldLabel htmlFor="website">وب‌سایت</FieldLabel>
        <Input id="website" type="url" {...register("website")} placeholder="https://example.com" />
        {errors.website && <span className="text-destructive text-sm">{errors.website.message}</span>}
      </Field>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "در حال ذخیره..." : "ذخیره"}
      </Button>
    </form>
  )
}
```

---

## Week Summary

### Checklist

- [ ] Created controlled forms
- [ ] Used React Hook Form
- [ ] Implemented Zod validation
- [ ] Handled form errors
- [ ] Built complex forms
- [ ] Understand form state management

### Confidence Check (1-5)

- Controlled components: ___ / 5
- React Hook Form: ___ / 5
- Zod validation: ___ / 5
- Error handling: ___ / 5

### Practice Project

Build a multi-step form:
- Step 1: Personal info
- Step 2: Contact details
- Step 3: Preferences
- Validation on each step
- Progress indicator

---

## Resources

- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)
- [Form Components](../../components/component-example.tsx)

---

**Previous**: [Week 4](week-04.md) | **Next**: [Week 6-7](week-06-07.md)
