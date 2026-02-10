# Week 8: State Management

**Duration**: 7 days
**Focus**: React Context, Zustand, global state patterns
**Prerequisites**: Week 1-7 completed

---

## Goals

By the end of this week, you will:
- ✅ Understand when to use state management
- ✅ Master React Context API
- ✅ Learn Zustand for global state
- ✅ Implement state persistence
- ✅ Choose the right tool for your needs

---

## When Do You Need State Management?

### You DON'T Need It If:
- Data is only used in one component
- Data is fetched from API on demand
- You can use props to pass data
- You have 1-2 pieces of global state

### You DO Need It If:
- Sharing state across many components
- Complex state updates
- Caching API responses
- User preferences (theme, language)
- Shopping cart, notifications, etc.

---

## Day 1-3: React Context

### Tasks

- [ ] Create theme context
- [ ] Create user context
- [ ] Understand context limitations
- [ ] Implement context with reducer

### Basic Context Pattern

**Create:** `lib/theme-context.tsx`

```tsx
"use client"

import { createContext, useContext, useState, ReactNode } from "react"

type Theme = "light" | "dark"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
```

**Usage in layout.tsx:**
```tsx
import { ThemeProvider } from "@/lib/theme-context"

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Usage in components:**
```tsx
"use client"

import { useTheme } from "@/lib/theme-context"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button onClick={toggleTheme}>
      {theme === "light" ? "🌙 تاریک" : "☀️ روشن"}
    </Button>
  )
}
```

### User Context

**Create:** `lib/user-context.tsx`

```tsx
"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useSession } from "next-auth/react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "user",
      })
    } else {
      setUser(null)
    }
  }, [session])

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoading: status === "loading",
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider")
  }
  return context
}
```

### Context with Reducer

**Create:** `lib/cart-context.tsx`

```tsx
"use client"

import { createContext, useContext, useReducer, ReactNode } from "react"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: number }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number } }
  | { type: "CLEAR_CART" }

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(item => item.id === action.payload.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          total: state.total + action.payload.price,
        }
      }

      return {
        items: [...state.items, action.payload],
        total: state.total + action.payload.price,
      }
    }

    case "REMOVE_ITEM": {
      const item = state.items.find(item => item.id === action.payload)
      if (!item) return state

      return {
        items: state.items.filter(item => item.id !== action.payload),
        total: state.total - (item.price * item.quantity),
      }
    }

    case "UPDATE_QUANTITY": {
      const item = state.items.find(item => item.id === action.payload.id)
      if (!item) return state

      const quantityDiff = action.payload.quantity - item.quantity

      return {
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        total: state.total + (item.price * quantityDiff),
      }
    }

    case "CLEAR_CART":
      return { items: [], total: 0 }

    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  })

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item })
  }

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: number, quantity: number) => {
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within CartProvider")
  }
  return context
}
```

---

## Day 4-5: Zustand (Recommended)

### Tasks

- [ ] Install Zustand
- [ ] Create stores
- [ ] Add persistence
- [ ] Migrate context to Zustand

### Installation

```bash
pnpm add zustand
```

### Basic Store

**Create:** `lib/store.ts`

```typescript
import { create } from "zustand"

interface User {
  id: string
  name: string
  email: string
}

interface StoreState {
  // User state
  user: User | null
  setUser: (user: User | null) => void

  // Theme state
  theme: "light" | "dark"
  toggleTheme: () => void

  // Counter example
  count: number
  increment: () => void
  decrement: () => void
}

export const useStore = create<StoreState>((set) => ({
  // User
  user: null,
  setUser: (user) => set({ user }),

  // Theme
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),

  // Counter
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}))
```

**Usage:**
```tsx
"use client"

import { useStore } from "@/lib/store"

export function Counter() {
  const count = useStore((state) => state.count)
  const increment = useStore((state) => state.increment)
  const decrement = useStore((state) => state.decrement)

  return (
    <div>
      <p>شمارش: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  )
}

export function ThemeToggle() {
  const theme = useStore((state) => state.theme)
  const toggleTheme = useStore((state) => state.toggleTheme)

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}
```

### Store with Persistence

```typescript
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
}

interface StoreState {
  user: User | null
  setUser: (user: User | null) => void
  theme: "light" | "dark"
  toggleTheme: () => void
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),
    }),
    {
      name: "app-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
)
```

### Separate Stores (Recommended)

**Create:** `lib/stores/user-store.ts`

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
    }
  )
)
```

**Create:** `lib/stores/cart-store.ts`

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }

          return { items: [...state.items, { ...item, quantity: 1 }] }
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ items: [] }),

      total: () => {
        const items = get().items
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
    }),
    {
      name: "cart-storage",
    }
  )
)
```

---

## Day 6-7: Advanced Patterns

### Tasks

- [ ] Implement selectors
- [ ] Use middleware
- [ ] Handle async actions
- [ ] Compare with Redux

### Selectors

```tsx
"use client"

import { useCartStore } from "@/lib/stores/cart-store"
import { useMemo } from "react"

export function CartSummary() {
  // ❌ Bad: Re-renders on any cart change
  const cart = useCartStore((state) => state)

  // ✅ Good: Only re-renders when total changes
  const total = useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  )

  // ✅ Good: Only re-renders when item count changes
  const itemCount = useCartStore((state) => state.items.length)

  return (
    <div>
      <p>تعداد: {itemCount}</p>
      <p>جمع: {total} تومان</p>
    </div>
  )
}
```

### Async Actions

```typescript
import { create } from "zustand"
import { apiClient } from "@/lib/api-client"

interface Product {
  id: number
  name: string
  price: number
}

interface ProductStore {
  products: Product[]
  loading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null })

    try {
      const products = await apiClient.get<Product[]>("/products")
      set({ products, loading: false })
    } catch (error) {
      set({
        error: "خطا در بارگذاری محصولات",
        loading: false,
      })
    }
  },
}))
```

### Custom Middleware

```typescript
import { create, StateCreator } from "zustand"

const logger = <T extends object>(config: StateCreator<T>): StateCreator<T> =>
  (set, get, api) =>
    config(
      (args) => {
        console.log("Before:", get())
        set(args)
        console.log("After:", get())
      },
      get,
      api
    )

export const useStore = create<StoreState>()(
  logger(
    persist(
      (set) => ({
        // ... your store
      }),
      { name: "app-storage" }
    )
  )
)
```

---

## Comparison: Context vs Zustand

| Feature | React Context | Zustand |
|---|---|---|
| **Setup** | More boilerplate | Minimal setup |
| **Performance** | Re-renders all consumers | Selective re-renders |
| **DevTools** | Limited | Excellent |
| **Persistence** | Manual | Built-in |
| **Async** | Manual | Easy |
| **TypeScript** | Good | Excellent |
| **Bundle Size** | 0 (built-in) | ~1KB |

**Use Context when:**
- Simple state (theme, locale)
- Wrapping with providers is natural
- State rarely changes

**Use Zustand when:**
- Complex state
- Frequent updates
- Need performance
- Want persistence
- Multiple stores

---

## Complete Example: E-Commerce Store

**Create:** `lib/stores/index.ts`

```typescript
import { create } from "zustand"
import { persist } from "zustand/middleware"

// Types
interface User {
  id: string
  name: string
  email: string
}

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

// Combined Store
interface AppStore {
  // User
  user: User | null
  setUser: (user: User | null) => void

  // Theme
  theme: "light" | "dark"
  toggleTheme: () => void

  // Cart
  cart: CartItem[]
  addToCart: (product: Product) => void
  removeFromCart: (id: number) => void
  updateCartQuantity: (id: number, quantity: number) => void
  clearCart: () => void
  cartTotal: () => number

  // Notifications
  notifications: string[]
  addNotification: (message: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // User
      user: null,
      setUser: (user) => set({ user }),

      // Theme
      theme: "light",
      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === "light" ? "dark" : "light",
        })),

      // Cart
      cart: [],

      addToCart: (product) =>
        set((state) => {
          const existing = state.cart.find((item) => item.id === product.id)

          if (existing) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            }
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          }
        }),

      removeFromCart: (id) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== id),
        })),

      updateCartQuantity: (id, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),

      clearCart: () => set({ cart: [] }),

      cartTotal: () => {
        const cart = get().cart
        return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },

      // Notifications
      notifications: [],

      addNotification: (message) =>
        set((state) => ({
          notifications: [...state.notifications, message],
        })),

      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        user: state.user,
        theme: state.theme,
        cart: state.cart,
      }),
    }
  )
)
```

---

## Week Summary

### Checklist

- [ ] Understand when to use state management
- [ ] Created Context providers
- [ ] Learned Zustand
- [ ] Implemented persistence
- [ ] Compared different solutions
- [ ] Built complete store

### Confidence Check (1-5)

- React Context: ___ / 5
- Zustand: ___ / 5
- State patterns: ___ / 5
- Performance: ___ / 5

### Practice Project

Build a todo app with:
- User authentication state
- Todo list state
- Theme state
- Persistence
- Use Zustand

---

## Resources

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [State Management Guide](https://react.dev/learn/managing-state)

---

**Previous**: [Week 6-7](week-06-07.md) | **Next**: [Week 9-10](week-09-10.md)
