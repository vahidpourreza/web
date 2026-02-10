# Week 2: React Fundamentals

**Duration**: 7 days
**Focus**: State management, props, hooks
**Prerequisites**: Week 1 completed

---

## Goals

- ✅ Master useState for component state
- ✅ Understand props and component composition
- ✅ Handle events (onClick, onChange)
- ✅ Learn useEffect for side effects
- ✅ Build interactive components

---

## JSX/TSX Syntax

**Key Points:**
- Use `className` not `class`
- `{}` for JavaScript expressions
- `{...props}` spreads props (like C# object spreading)
- Self-closing: `<Button />` vs `<Button></Button>`

**Example:**
```tsx
<Comp
  data-slot="button"
  data-variant={variant}
  className={cn(buttonVariants({ variant, size }))}
  {...props}
/>
```

---

## Component Types

### Server Components (default)
```tsx
// Runs on server, can't use hooks
export default function Page() {
  return <div>Server rendered</div>
}
```

### Client Components
```tsx
"use client"  // Required for hooks

import { useState } from "react"

export function Counter() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## Day 1-2: State Management

### Tasks

- [ ] Create counter component with useState
- [ ] Build simple form with multiple inputs
- [ ] Understand controlled vs uncontrolled components
- [ ] Study state updates in component-example.tsx

### useState Hook

**Syntax:**
```tsx
const [state, setState] = useState(initialValue)
```

**Example:**
```tsx
const [notifications, setNotifications] = useState({
  email: true,
  sms: false,
  push: true,
})

// Update:
setNotifications({ ...notifications, email: false })
```

**Practice: Build a Todo Component**
```tsx
"use client"

import { useState } from "react"

export function TodoList() {
  const [todos, setTodos] = useState<string[]>([])
  const [input, setInput] = useState("")

  const addTodo = () => {
    setTodos([...todos, input])
    setInput("")
  }

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={addTodo}>افزودن</button>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  )
}
```

---

## Day 3-4: Props & Composition

### Tasks

- [ ] Create reusable `UserCard` component with props
- [ ] Pass data from parent to child
- [ ] Understand `children` prop
- [ ] Study how Card component uses composition

### Props Pattern

```tsx
interface ButtonProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = "default",
  size = "default",
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={`btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

// Usage:
<Button variant="outline" size="lg" onClick={() => alert("Clicked!")}>
  Click me
</Button>
```

**Practice: UserCard Component**
```tsx
interface User {
  name: string
  email: string
  role: string
}

interface UserCardProps {
  user: User
  onEdit?: () => void
}

export function UserCard({ user, onEdit }: UserCardProps) {
  return (
    <div className="border p-4 rounded">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <span className="badge">{user.role}</span>
      {onEdit && <button onClick={onEdit}>ویرایش</button>}
    </div>
  )
}
```

---

## Day 5-7: Events & Effects

### Tasks

- [ ] Add onClick, onChange, onSubmit handlers
- [ ] Use useEffect to fetch data
- [ ] Understand dependency arrays
- [ ] Create component that fetches and displays data

### Event Handling

```tsx
"use client"

import { useState } from "react"

export function Form() {
  const [formData, setFormData] = useState({ name: "", email: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formData.name} onChange={handleChange} />
      <input name="email" value={formData.email} onChange={handleChange} />
      <button type="submit">ارسال</button>
    </form>
  )
}
```

### useEffect Hook

**Syntax:**
```tsx
useEffect(() => {
  // Runs after render
  console.log("Component mounted")

  return () => {
    // Cleanup (like IDisposable)
    console.log("Component unmounted")
  }
}, [dependencies])  // When to re-run
```

**Dependency Array:**
- `[]` - Run once on mount
- `[count]` - Run when count changes
- No array - Run on every render

**Practice: Data Fetching**
```tsx
"use client"

import { useState, useEffect } from "react"

interface User {
  id: number
  name: string
}

export function UserList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data)
        setLoading(false)
      })
  }, [])  // Run once

  if (loading) return <div>در حال بارگذاری...</div>

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  )
}
```

---

## Common Patterns

### Conditional Rendering
```tsx
{user && <div>Welcome {user.name}</div>}
{isLoading ? <Spinner /> : <Content />}
{error && <div className="text-red-500">{error}</div>}
```

### List Rendering
```tsx
{users.map(user => (
  <div key={user.id}>{user.name}</div>
))}
```

### Form Handling
```tsx
const [email, setEmail] = useState("")

<input
  value={email}
  onChange={(e) => setEmail(e.target.value)}
/>
```

---

## Week Summary

### Checklist

- [ ] Created interactive components with useState
- [ ] Built forms with controlled inputs
- [ ] Passed props between components
- [ ] Used useEffect for data fetching
- [ ] Understand dependency arrays
- [ ] Handle events properly

### Confidence Check (1-5)

- useState usage: ___ / 5
- Props & composition: ___ / 5
- Event handling: ___ / 5
- useEffect understanding: ___ / 5

---

## Resources

- [React Hooks](https://react.dev/reference/react)
- [useState Hook](https://react.dev/reference/react/useState)
- [useEffect Hook](https://react.dev/reference/react/useEffect)

---

**Previous**: [Week 1](week-01.md) | **Next**: [Week 3](week-03.md)
