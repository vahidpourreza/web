# Week 1: Understanding the Foundation

**Duration**: 7 days
**Focus**: Project structure, components, RTL configuration
**Prerequisites**: None - This is where you start!

---

## Goals

By the end of this week, you will:
- ✅ Understand the Next.js project structure
- ✅ Know the difference between .NET and React/Next.js architecture
- ✅ Create your first React component
- ✅ Understand RTL (Right-to-Left) configuration
- ✅ Be comfortable reading existing components

---

## Core Concepts (.NET → React/Next.js)

| .NET Concept | Next.js Equivalent |
|---|---|
| `Program.cs` / `Startup.cs` | app/layout.tsx |
| Controller | Page component (page.tsx) |
| View / Razor Page | React Component (.tsx) |
| Model / DTO | TypeScript interface |
| Dependency Injection | React Context + Hooks |
| Middleware | middleware.ts |
| appsettings.json | .env.local |
| Partial View | Reusable Component |

### Key Differences

1. **No Controllers**: Pages ARE the endpoints
2. **Component-Based**: Everything is a function returning JSX
3. **Client vs Server**: Components run on server by default
4. **TypeScript**: Similar to C#, different syntax

---

## Day 1-2: Setup & Exploration

### Tasks

- [ ] Run `pnpm dev` and open http://localhost:3000
- [ ] Explore the demo page - click all UI components
- [ ] Read `app/page.tsx` - understand what it renders
- [ ] Read `app/layout.tsx` - see RTL setup

### Key Learnings

**RTL Configuration:**
```tsx
<html lang="fa" dir="rtl">
  <body>
    <DirectionProvider dir="rtl">
      {children}
    </DirectionProvider>
  </body>
</html>
```

**File Structure:**
- `app/` = routes
- `page.tsx` = endpoint
- `layout.tsx` = wrapper

### Questions to Answer

1. What does `{children}` mean?
2. Why `lang="fa"`?
3. What does DirectionProvider do?

---

## Day 3-4: Component Fundamentals

### Tasks

- [ ] Study `components/ui/button.tsx`
  - Understand `buttonVariants`
  - See how `cva` works
  - Notice TypeScript props

- [ ] Create `components/hello.tsx`:
```tsx
export function Hello({ name }: { name: string }) {
  return <div>سلام {name}!</div>
}
```

- [ ] Import and use in `app/page.tsx`:
```tsx
import { Hello } from "@/components/hello"

// In return statement:
<Hello name="دنیا" />
```

### Key Learnings

**Component Anatomy:**
```tsx
// Props interface
interface ButtonProps {
  variant?: "default" | "outline"
  children: React.ReactNode
}

// Component function
export function Button({ variant = "default", children }: ButtonProps) {
  return <button className={`btn-${variant}`}>{children}</button>
}
```

### Questions to Answer

1. Difference between `{ }` and `< />`?
2. Why `@/components` instead of `../components`?
3. What does `children` prop contain?

---

## Day 5-7: Understanding Existing Code

### Tasks

- [ ] Read `components/component-example.tsx`
- [ ] Identify component hierarchy
- [ ] Understand `"use client"` directive
- [ ] Experiment with Persian text changes

### Key Learnings

**Component Composition:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>عنوان</CardTitle>
  </CardHeader>
  <CardFooter>
    <Button>دکمه</Button>
  </CardFooter>
</Card>
```

**"use client" Directive:**
```tsx
"use client"  // First line

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

**When to use:**
- ✅ useState, useEffect, hooks
- ✅ Event handlers (onClick)
- ✅ Browser APIs (localStorage)
- ❌ Simple display components

### Questions to Answer

1. How many nested component levels?
2. What happens without `"use client"`?
3. How does RTL affect spacing?

---

## Week Summary

### Checklist

- [ ] Understand project structure
- [ ] Read layout.tsx and page.tsx
- [ ] Created first component
- [ ] Understand component composition
- [ ] Know when to use "use client"
- [ ] Understand RTL configuration

### Confidence Check (1-5)

- Project structure: ___ / 5
- Component creation: ___ / 5
- Reading code: ___ / 5
- RTL understanding: ___ / 5

### Ready for Week 2?

- [ ] Yes!
- [ ] Need more practice
- [ ] Have questions

---

## Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [React Components](https://react.dev/learn/your-first-component)
- [app/layout.tsx](../../app/layout.tsx)
- [app/page.tsx](../../app/page.tsx)
- [components/ui/button.tsx](../../components/ui/button.tsx)

---

**Next**: [Week 2 - React Fundamentals](week-02.md)
