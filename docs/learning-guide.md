# Next.js Learning Guide - Quick Reference

> For .NET developers. Full plan: C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md

## Current Focus: Week 1 - Foundation

### Today's Goal
Understand project structure and create your first component.

---

## Quick File Reference

| Need to... | Look at... | Why |
|---|---|---|
| Change home page | `app/page.tsx` | Main route (/) |
| Modify app-wide layout | `app/layout.tsx` | Like master page |
| Add a component | `components/ui/` | Reusable UI pieces |
| Add utility function | `lib/utils.ts` | Helper functions |
| Style changes | `app/globals.css` | Theme colors |

---

## .NET → React/Next.js Mapping

### Architecture
- **Controller** → Page component (`app/page.tsx`)
- **View** → React component (`.tsx` files)
- **Partial View** → Reusable component (`components/`)
- **DI Container** → React Context + Hooks
- **Middleware** → `middleware.ts`
- **appsettings.json** → `.env.local`

### Code Concepts
- **Class** → Function component
- **Method** → Function
- **Property** → State (useState) or Props
- **Constructor** → useEffect with []
- **IDisposable** → useEffect cleanup
- **LINQ** → Array methods (.map, .filter, .find)

---

## Essential Commands

```bash
pnpm dev          # Start dev server (like dotnet run)
pnpm build        # Build for production
pnpm lint         # Check code quality
```

---

## Component Anatomy

```tsx
// Like a class in .NET
export function MyComponent({ name }: { name: string }) {
  // Props = method parameters

  // State = class fields
  const [count, setCount] = useState(0)

  // Return = Render method
  return <div>Hello {name}, count: {count}</div>
}
```

---

## Common Patterns

### 1. Conditional Rendering
```tsx
// Like: if (user != null) { return View(); }
{user && <div>Welcome {user.name}</div>}
{isLoading ? <Spinner /> : <Content />}
```

### 2. List Rendering
```tsx
// Like: foreach (var user in users) { ... }
{users.map(user => (
  <div key={user.id}>{user.name}</div>
))}
```

### 3. Event Handling
```tsx
// Like: OnClick event handler
<button onClick={() => setCount(count + 1)}>
  Click me
</button>
```

### 4. Form Handling
```tsx
const [email, setEmail] = useState("")

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## When to Use "use client"

Add `"use client"` at top of file when:
- Using useState, useEffect, or other hooks
- Using event handlers (onClick, onChange)
- Using browser APIs (localStorage, window)

Don't add it for:
- Simple display components
- Components that fetch data on server

---

## Tailwind CSS Quick Reference

### Layout
- `flex` - Flexbox container
- `flex-col` - Column direction
- `items-center` - Align items center
- `justify-between` - Space between
- `gap-4` - Space between items (1rem)

### Spacing (1 unit = 0.25rem)
- `p-4` - Padding all sides
- `px-2` - Padding horizontal
- `py-2` - Padding vertical
- `m-4` - Margin
- `space-x-2` - Space between children

### Sizing
- `w-full` - Width 100%
- `h-8` - Height 2rem
- `max-w-sm` - Max width small

### Colors (from theme)
- `bg-primary` - Primary background
- `text-foreground` - Text color
- `border-border` - Border color

### RTL Support
- `ps-2` - Padding start (adapts to RTL)
- `pe-2` - Padding end
- `ms-auto` - Margin start auto

---

## Week 1 Task Summary

**Day 1-2**: Exploration
- Run `pnpm dev`, explore demo
- Read `app/page.tsx` and `app/layout.tsx`

**Day 3-4**: First Component
- Study `components/ui/button.tsx`
- Create `components/hello.tsx`
- Import and use it

**Day 5-7**: Understand Composition
- Read `components/component-example.tsx`
- See how components nest
- Modify Persian text and test

[Track progress in docs/progress.md]

---

## Troubleshooting

### Component not showing?
1. Check import path: `@/components/ui/button`
2. Did you export the component? `export function MyComponent()`
3. Is it inside the return statement?

### Styling not working?
1. Check className (not class)
2. Verify Tailwind class name spelling
3. Check if using theme colors (bg-primary vs bg-blue-500)

### "Hooks can only be called..."?
1. Add `"use client"` at top of file
2. Don't call hooks inside loops or conditions
3. Only call hooks in component functions

---

## Next Steps

When you complete Week 1, move to Week 2 in the full plan:
[C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md]

---

## Quick Links

- [Full Learning Plan](C:\Users\Admin\.claude\plans\vectorized-orbiting-blanket.md)
- [Progress Tracker](progress.md)
- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [shadcn/ui Components](https://ui.shadcn.com)
