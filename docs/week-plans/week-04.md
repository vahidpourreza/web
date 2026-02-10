# Week 4: Styling with Tailwind CSS

**Duration**: 7 days
**Focus**: Utility-first CSS, theme system, responsive design
**Prerequisites**: Week 1-3 completed

---

## Goals

By the end of this week, you will:
- ✅ Master Tailwind utility classes
- ✅ Understand the theme system
- ✅ Create responsive layouts
- ✅ Use component variants with cva
- ✅ Work with RTL-aware spacing

---

## Tailwind Fundamentals

Tailwind uses **utility classes** instead of writing custom CSS.

### Traditional CSS vs Tailwind

**Traditional CSS:**
```css
.button {
  background-color: #3490dc;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
```

**Tailwind:**
```tsx
<button className="bg-blue-500 text-white px-4 py-2 rounded">
  Click me
</button>
```

### Why Tailwind?

- **Faster development** - No switching between files
- **Consistent design** - Predefined spacing/colors
- **Smaller bundle** - Only used classes included
- **Responsive** - Built-in breakpoints

---

## Day 1-2: Basic Styling

### Tasks

- [ ] Style a component using Tailwind utilities
- [ ] Understand spacing system (0.25rem increments)
- [ ] Practice with flexbox layouts

### Common Tailwind Classes

**Layout:**
```tsx
<div className="flex items-center justify-between gap-4">
  {/* Flexbox container with alignment and gap */}
</div>

<div className="grid grid-cols-3 gap-4">
  {/* Grid with 3 columns */}
</div>
```

**Spacing (1 unit = 0.25rem):**
```tsx
<div className="p-4">      {/* padding: 1rem (all sides) */}
<div className="px-2">     {/* padding: 0.5rem (horizontal) */}
<div className="py-2">     {/* padding: 0.5rem (vertical) */}
<div className="m-4">      {/* margin: 1rem (all sides) */}
<div className="space-x-2">{/* gap between children */}
```

**Sizing:**
```tsx
<div className="w-full">    {/* width: 100% */}
<div className="w-1/2">     {/* width: 50% */}
<div className="h-8">       {/* height: 2rem */}
<div className="max-w-sm">  {/* max-width: 24rem */}
```

**Colors:**
```tsx
<div className="bg-blue-500 text-white border-gray-300">
  {/* Background, text, and border colors */}
</div>
```

**Typography:**
```tsx
<p className="text-sm font-medium leading-6">
  {/* Font size: 0.875rem, weight: 500, line-height: 1.5rem */}
</p>
```

### Practice: Style a Card

```tsx
export function StyledCard() {
  return (
    <div className="max-w-md p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        عنوان کارت
      </h2>
      <p className="text-gray-600 text-sm mb-4">
        این یک کارت نمونه با استایل تیلویند است
      </p>
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        کلیک کنید
      </button>
    </div>
  )
}
```

### RTL Support

**Directional Spacing:**
```tsx
{/* LTR: padding-left, RTL: padding-right */}
<div className="ps-2">  {/* padding-start */}
<div className="pe-2">  {/* padding-end */}

{/* LTR: margin-left, RTL: margin-right */}
<div className="ms-auto"> {/* margin-start: auto */}
<div className="me-auto"> {/* margin-end: auto */}
```

---

## Day 3-4: Theme Integration

### Tasks

- [ ] Use theme colors instead of fixed colors
- [ ] Study app/globals.css
- [ ] Modify theme colors and see changes
- [ ] Understand CSS variables

### Theme System

**Location:** `d:\1.Services\web\app\globals.css`

**Theme Colors (CSS Variables):**
```css
:root {
  --primary: oklch(0.488 0.243 264.376);
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --muted: oklch(0.961 0 0);
  --border: oklch(0.921 0 0);
}

.dark {
  --primary: oklch(0.42 0.18 266);
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.98 0 0);
}
```

**Using Theme Colors:**
```tsx
{/* Instead of bg-blue-500 */}
<div className="bg-primary text-primary-foreground">
  Primary button
</div>

{/* Background and text */}
<div className="bg-background text-foreground">
  Page content
</div>

{/* Card styling */}
<div className="bg-card text-card-foreground border-border">
  Card content
</div>

{/* Muted text */}
<p className="text-muted-foreground">
  Secondary text
</p>
```

### Theme Color Reference

| CSS Variable | Usage | Example |
|---|---|---|
| `--primary` | Primary buttons, links | `bg-primary` |
| `--background` | Page background | `bg-background` |
| `--foreground` | Main text color | `text-foreground` |
| `--card` | Card background | `bg-card` |
| `--muted` | Muted backgrounds | `bg-muted` |
| `--border` | Border color | `border-border` |
| `--destructive` | Error/delete actions | `bg-destructive` |

### Practice: Theme-Aware Component

```tsx
export function ThemedCard() {
  return (
    <div className="bg-card text-card-foreground border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-2">
        عنوان
      </h3>
      <p className="text-muted-foreground text-sm mb-4">
        این متن با رنگ muted نمایش داده می‌شود
      </p>
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded">
          اصلی
        </button>
        <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded">
          ثانویه
        </button>
        <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded">
          حذف
        </button>
      </div>
    </div>
  )
}
```

### Modifying Theme

**Change primary color in globals.css:**
```css
:root {
  --primary: oklch(0.6 0.25 150);  /* Green primary */
}
```

All components using `bg-primary` will update automatically!

---

## Day 5-7: Advanced Styling

### Tasks

- [ ] Create responsive layouts with breakpoints
- [ ] Understand cn() utility
- [ ] Study button variants in button.tsx
- [ ] Build a responsive navigation

### Responsive Design

**Breakpoints:**
```tsx
<div className="
  w-full        /* Mobile: full width */
  md:w-1/2      /* Tablet (768px+): half width */
  lg:w-1/3      /* Desktop (1024px+): third width */
  xl:w-1/4      /* Large desktop (1280px+): quarter width */
">
  Content
</div>
```

**Breakpoint Sizes:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Hide/Show at Breakpoints:**
```tsx
<div className="hidden md:block">
  {/* Hidden on mobile, visible on tablet+ */}
</div>

<div className="block md:hidden">
  {/* Visible on mobile, hidden on tablet+ */}
</div>
```

### The cn() Utility

**Location:** `d:\1.Services\web\lib\utils.ts`

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Purpose:**
- Combines class names
- Handles conditional classes
- Resolves conflicting Tailwind classes

**Usage:**
```tsx
import { cn } from "@/lib/utils"

// Conditional classes
<div className={cn(
  "px-4 py-2",
  isActive && "bg-primary",
  isDisabled && "opacity-50"
)} />

// Merging classes (resolves conflicts)
<div className={cn(
  "px-4",    // padding-x: 1rem
  "px-2"     // ← This wins (padding-x: 0.5rem)
)} />
```

### Component Variants with CVA

**Study:** `d:\1.Services\web\components\ui\button.tsx`

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-lg text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-border bg-background hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-destructive-foreground",
      },
      size: {
        default: "h-8 px-4",
        sm: "h-7 px-3 text-xs",
        lg: "h-10 px-6",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

export function Button({ variant, size, children }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })}>
      {children}
    </button>
  )
}

// Usage:
<Button variant="outline" size="sm">کلیک کنید</Button>
```

### Practice: Responsive Navigation

```tsx
export function Navigation() {
  return (
    <nav className="bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-xl font-bold">
            لوگو
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            <a href="/" className="px-3 py-2 hover:bg-muted rounded">
              خانه
            </a>
            <a href="/about" className="px-3 py-2 hover:bg-muted rounded">
              درباره
            </a>
            <a href="/contact" className="px-3 py-2 hover:bg-muted rounded">
              تماس
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden px-3 py-2">
            ☰
          </button>
        </div>
      </div>
    </nav>
  )
}
```

---

## Hover, Focus & Active States

```tsx
<button className="
  bg-primary
  hover:bg-primary/90       /* Hover state */
  focus:ring-2              /* Focus ring */
  focus:ring-primary        /* Ring color */
  active:scale-95           /* Press animation */
  disabled:opacity-50       /* Disabled state */
  disabled:cursor-not-allowed
">
  Button
</button>
```

---

## Dark Mode

Your project is dark mode ready!

```css
/* Light mode */
:root {
  --background: oklch(1 0 0);     /* White */
  --foreground: oklch(0.145 0 0); /* Black */
}

/* Dark mode */
.dark {
  --background: oklch(0.145 0 0); /* Black */
  --foreground: oklch(0.98 0 0);  /* White */
}
```

**Toggle dark mode (add later):**
```tsx
<html className={isDark ? "dark" : ""}>
```

---

## Week Summary

### Checklist

- [ ] Understand Tailwind utility classes
- [ ] Use theme colors consistently
- [ ] Create responsive layouts
- [ ] Use cn() utility
- [ ] Understand component variants with cva
- [ ] Handle RTL spacing correctly

### Confidence Check (1-5)

- Tailwind utilities: ___ / 5
- Theme system: ___ / 5
- Responsive design: ___ / 5
- Component variants: ___ / 5

### Practice Project

Build a responsive card grid:
- 1 column on mobile
- 2 columns on tablet
- 3 columns on desktop
- Use theme colors
- Add hover effects

---

## Resources

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Tailwind Colors](https://tailwindcss.com/docs/customizing-colors)
- [CVA Documentation](https://cva.style)
- [app/globals.css](../../app/globals.css)
- [components/ui/button.tsx](../../components/ui/button.tsx)

---

**Previous**: [Week 3](week-03.md) | **Next**: [Week 5](week-05.md)
