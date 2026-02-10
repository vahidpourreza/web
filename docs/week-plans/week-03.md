# Week 3: Next.js Routing & Pages

**Duration**: 7 days
**Focus**: App Router, dynamic routes, layouts, navigation
**Prerequisites**: Week 1-2 completed

---

## Goals

- ✅ Understand folder-based routing
- ✅ Create dynamic routes
- ✅ Use layouts effectively
- ✅ Navigate between pages
- ✅ Handle loading and error states

---

## App Router System

Next.js uses **folder-based routing**. Each folder in `app/` becomes a route.

```
app/
├── page.tsx                → / (home)
├── about/
│   └── page.tsx           → /about
├── products/
│   ├── page.tsx           → /products (list)
│   └── [id]/
│       └── page.tsx       → /products/123 (detail)
└── dashboard/
    ├── layout.tsx         → Layout for dashboard
    └── page.tsx           → /dashboard
```

---

## Special Files

| File | Purpose | Example |
|---|---|---|
| `page.tsx` | Route endpoint (visible URL) | `/products` page |
| `layout.tsx` | Shared layout (wraps children) | Dashboard layout |
| `loading.tsx` | Loading UI (automatic) | Skeleton screen |
| `error.tsx` | Error boundary | Error page |
| `not-found.tsx` | 404 page | Not found page |

---

## Day 1-3: Basic Routes

### Tasks

- [ ] Create `/about` page
- [ ] Create `/products` page with product list
- [ ] Create `/products/[id]` dynamic route
- [ ] Add navigation with Link component

### Creating Routes

**1. Create About Page:**
```tsx
// app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <h1>درباره ما</h1>
      <p>این صفحه درباره ماست</p>
    </div>
  )
}
```

**2. Create Products Page:**
```tsx
// app/products/page.tsx
export default function ProductsPage() {
  const products = [
    { id: 1, name: "محصول ۱" },
    { id: 2, name: "محصول ۲" },
  ]

  return (
    <div>
      <h1>محصولات</h1>
      <ul>
        {products.map(product => (
          <li key={product.id}>
            <Link href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**3. Create Dynamic Route:**
```tsx
// app/products/[id]/page.tsx
export default function ProductPage({ params }: { params: { id: string } }) {
  return <div>Product ID: {params.id}</div>
}
```

### Navigation with Link

```tsx
import Link from "next/link"

<Link href="/about">درباره ما</Link>
<Link href={`/products/${productId}`}>مشاهده محصول</Link>
```

---

## Day 4-5: Layouts

### Tasks

- [ ] Create dashboard layout with sidebar
- [ ] Understand how root layout works
- [ ] Create nested layouts

### Creating Layouts

**Dashboard Layout:**
```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4">
        <nav>
          <Link href="/dashboard">خانه</Link>
          <Link href="/dashboard/users">کاربران</Link>
          <Link href="/dashboard/settings">تنظیمات</Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  )
}
```

**How Layouts Work:**
```
Root Layout (app/layout.tsx)
  └─ Dashboard Layout (app/dashboard/layout.tsx)
      └─ Page (app/dashboard/page.tsx)
```

---

## Day 6-7: Advanced Routing

### Tasks

- [ ] Create catch-all routes: `[...slug]`
- [ ] Add loading.tsx for loading states
- [ ] Add error.tsx for error handling
- [ ] Use route groups: `(auth)`

### Catch-All Routes

```tsx
// app/docs/[...slug]/page.tsx
export default function DocsPage({
  params,
}: {
  params: { slug: string[] }
}) {
  // /docs/getting-started → ["getting-started"]
  // /docs/api/users → ["api", "users"]
  return <div>Path: {params.slug.join("/")}</div>
}
```

### Loading States

```tsx
// app/dashboard/loading.tsx
export default function Loading() {
  return <div>در حال بارگذاری...</div>
}
```

### Error Handling

```tsx
// app/dashboard/error.tsx
"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>خطایی رخ داد</h2>
      <p>{error.message}</p>
      <button onClick={reset}>تلاش مجدد</button>
    </div>
  )
}
```

### Route Groups

```tsx
// app/(auth)/login/page.tsx
// app/(auth)/register/page.tsx
// URL: /login and /register (no /auth in URL)

// app/(auth)/layout.tsx - Shared layout for auth pages
export default function AuthLayout({ children }) {
  return (
    <div className="auth-container">
      {children}
    </div>
  )
}
```

---

## Programmatic Navigation

```tsx
"use client"

import { useRouter } from "next/navigation"

export function LoginButton() {
  const router = useRouter()

  const handleLogin = () => {
    // After successful login
    router.push("/dashboard")
  }

  return <button onClick={handleLogin}>ورود</button>
}
```

---

## Week Summary

### Checklist

- [ ] Created multiple pages
- [ ] Implemented dynamic routes
- [ ] Used layouts effectively
- [ ] Added navigation with Link
- [ ] Handled loading and errors
- [ ] Understand route groups

### Confidence Check (1-5)

- Routing system: ___ / 5
- Dynamic routes: ___ / 5
- Layouts: ___ / 5
- Navigation: ___ / 5

---

## Resources

- [Next.js Routing](https://nextjs.org/docs/app/building-your-application/routing)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Layouts](https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts)

---

**Previous**: [Week 2](week-02.md) | **Next**: [Week 4](week-04.md)
